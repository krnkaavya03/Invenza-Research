require('dotenv').config({ path: '../.env' });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const csvPath = path.join(__dirname, '..', 'data', 'uci', 'invenza_products_200.csv');
const EMAIL = process.env.INVENZA_IMPORT_EMAIL;

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const values = [];
        let value = '';
        let quoted = false;

        for (let i = 0; i < line.length; i++) {
            const c = line[i];

            if (c === '"') {
                quoted = !quoted;
            } else if (c === ',' && !quoted) {
                values.push(value);
                value = '';
            } else {
                value += c;
            }
        }

        values.push(value);

        const row = {};
        headers.forEach((h, i) => {
            row[h] = values[i] ?? '';
        });
        return row;
    });
}

async function run() {
    if (!EMAIL) throw new Error('Set INVENZA_IMPORT_EMAIL in the root .env file.');
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email: EMAIL });
    if (!user) throw new Error('Invenza user not found.');

    const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));

    const existing = await Product.countDocuments({ userId: user._id });

    console.log('USER:', user.email);
    console.log('EXISTING PRODUCTS:', existing);
    console.log('CSV PRODUCTS:', rows.length);

    if (existing > 0) {
        throw new Error('Products already exist. Import cancelled.');
    }

    const products = rows.map(r => ({
        name: r.Description.trim(),
        shortName: r.Description.trim(),
        fullName: r.Description.trim(),
        sku: r.StockCode.trim(),
        category: r.Category || 'General',
        baseCost: Number(r.BaseCost),
        currentPrice: Number(r.CurrentPrice),
        stockLevel: Number(r.StockLevel),
        reorderThreshold: Number(r.ReorderThreshold),
        description: 'Imported from the UCI Online Retail dataset. Base cost and stock level are derived fields for Invenza testing; they are not source-record facts.',
        source: 'manual',
        userId: user._id
    }));

    await Product.insertMany(products, { ordered: true });

    console.log('IMPORTED PRODUCTS:', products.length);
    console.log('FINAL PRODUCT COUNT:', await Product.countDocuments({ userId: user._id }));

    await mongoose.disconnect();
}

run().catch(async err => {
    console.error('IMPORT FAILED:', err.message);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
});
