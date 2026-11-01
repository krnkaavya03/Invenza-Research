require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const CompetitorPrice = require('./models/CompetitorPrice');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const products = await Product.find({ userId: '6aa987675288fa5ed69263f3' }).limit(100);

  await CompetitorPrice.deleteMany({
    productId: { $in: products.map(p => p._id) },
    competitorName: { $in: ['Demo Amazon', 'Demo Flipkart', 'Demo Meesho'] }
  });

  const docs = [];
  for (const p of products) {
    const price = Number(p.currentPrice || 100);
    docs.push(
      { productId:p._id, competitorName:'Demo Amazon', productName:p.name+' (Demo)', competitorPrice:Number((price*1.05).toFixed(2)), competitorUrl:'', inStock:true },
      { productId:p._id, competitorName:'Demo Flipkart', productName:p.name+' (Demo)', competitorPrice:Number((price*0.97).toFixed(2)), competitorUrl:'', inStock:true },
      { productId:p._id, competitorName:'Demo Meesho', productName:p.name+' (Demo)', competitorPrice:Number((price*1.02).toFixed(2)), competitorUrl:'', inStock:true }
    );
  }

  await CompetitorPrice.insertMany(docs);
  console.log('DEMO COMPETITOR RECORDS:', docs.length);
  console.log('PRODUCTS COVERED:', products.length);
  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
