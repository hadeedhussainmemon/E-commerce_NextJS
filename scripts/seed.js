
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Simple Mongoose connect (isolated script)
// Usage: node scripts/seed.js <MONGODB_URI>

const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Error: Please provide a MONGODB_URI as an argument or env var.');
    console.log('Usage: node scripts/seed.js mongodb+srv://...');
    process.exit(1);
}

// Define Schema inline for script simplicity (or import)
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    colors: [String],
    stock: Number,
    isFeatured: Boolean,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        // 1. Fetch data from old backend
        console.log('📡 Fetching data from legacy API (coolcache.onrender.com)...');
        const res = await fetch('https://coolcache.onrender.com/api/products?limit=500');
        if (!res.ok) throw new Error('Failed to fetch from legacy API');
        const data = await res.json();
        const products = data.products || [];

        console.log(`📦 Found ${products.length} products.`);

        if (products.length === 0) {
            console.log('⚠️ No products found to seed.');
            return;
        }

        // 2. Clear existing data
        console.log('🧹 Clearing existing products in new DB...');
        await Product.deleteMany({});

        // 3. Transform and Insert
        console.log('🌱 Seeding new products...');
        const transformed = products.map(p => ({
            title: p.title,
            description: p.description,
            price: p.price,
            image: p.image,
            category: Array.isArray(p.category) ? (p.category[0] || 'Uncategorized') : (p.category || 'Uncategorized'),
            colors: p.colors || [],
            stock: p.stock ?? 10,
            isFeatured: p.isFeatured || false
        }));

        await Product.insertMany(transformed);

        console.log(`🎉 Success! Seeded ${transformed.length} products.`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected.');
    }
}

seed();
