require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const XLSX = require('xlsx');

const Product = require('./models/Product');
const Order = require('./models/Order');
const DailySalesMetric = require('./models/DailySalesMetric');
const User = require('./models/User');

const EMAIL = process.env.INVENZA_IMPORT_EMAIL;

async function run() {
    if (!EMAIL) throw new Error('Set INVENZA_IMPORT_EMAIL in the root .env file.');
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email: EMAIL });
    if (!user) throw new Error('User not found.');

    const products = await Product.find({ userId: user._id });
    if (!products.length) throw new Error('No products found.');

    const productMap = new Map(products.map(p => [String(p.sku).trim(), p]));

    const xlsxPath = path.join(
        __dirname,
        '..',
        'data',
        'uci',
        'extracted',
        'Online Retail.xlsx'
    );

    if (!fs.existsSync(xlsxPath)) {
        throw new Error(`Dataset not found: ${xlsxPath}`);
    }

    console.log('Reading UCI Online Retail dataset...');
    const workbook = XLSX.readFile(xlsxPath, {
        cellDates: true,
        sheetRows: 0
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    console.log('UCI TRANSACTIONS:', rows.length);
    console.log('INVENZA PRODUCTS:', products.length);

    const matched = [];
    const seenOrders = new Set();

    for (const row of rows) {
        const stockCode = String(row.StockCode ?? '').trim();
        const product = productMap.get(stockCode);

        if (!product) continue;

        const invoiceNo = String(row.InvoiceNo ?? '').trim();
        const quantity = Number(row.Quantity);
        const unitPrice = Number(row.UnitPrice);
        const invoiceDate = row.InvoiceDate;

        if (!invoiceNo || !Number.isFinite(quantity) || quantity <= 0) continue;
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) continue;
        if (!(invoiceDate instanceof Date) || isNaN(invoiceDate.getTime())) continue;

        const orderId = `UCI-${invoiceNo}-${stockCode}`;

        if (seenOrders.has(orderId)) continue;
        seenOrders.add(orderId);

        matched.push({
            userId: user._id,
            productId: product._id,
            orderId,
            quantity,
            salePrice: unitPrice,
            totalAmount: quantity * unitPrice,
            purchasedAt: invoiceDate,
            source: 'manual_csv',
            externalOrderId: invoiceNo,
            platformData: {
                dataset: 'UCI Online Retail',
                stockCode,
                customerId: row.CustomerID ?? null,
                country: row.Country ?? null
            }
        });
    }

    console.log('MATCHED TRANSACTIONS:', matched.length);

    if (!matched.length) {
        throw new Error('No UCI transactions matched the imported products.');
    }

    const existing = await Order.countDocuments({ userId: user._id });

    if (existing > 0) {
        throw new Error(`Orders already exist (${existing}). Import cancelled.`);
    }

    console.log('Inserting historical orders...');

    await Order.insertMany(matched, { ordered: false });

    console.log('Building DailySalesMetric records...');

    const metricMap = new Map();

    for (const order of matched) {
        const d = order.purchasedAt;
        const date = new Date(Date.UTC(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate()
        ));

        const key = `${order.productId}_${date.toISOString()}`;

        if (!metricMap.has(key)) {
            metricMap.set(key, {
                userId: user._id,
                productId: order.productId,
                date,
                totalUnitsSold: 0,
                totalRevenue: 0
            });
        }

        const metric = metricMap.get(key);
        metric.totalUnitsSold += order.quantity;
        metric.totalRevenue += order.totalAmount;
    }

    const metrics = Array.from(metricMap.values()).map(m => ({
        ...m,
        averageSalePrice:
            m.totalUnitsSold > 0
                ? m.totalRevenue / m.totalUnitsSold
                : 0
    }));

    await DailySalesMetric.insertMany(metrics, { ordered: false });

    console.log('DAILY SALES METRICS:', metrics.length);
    console.log('FINAL ORDERS:', await Order.countDocuments({ userId: user._id }));
    console.log('FINAL DAILY METRICS:', await DailySalesMetric.countDocuments({ userId: user._id }));

    await mongoose.disconnect();
}

run().catch(async err => {
    console.error('IMPORT FAILED:', err.message);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
});
