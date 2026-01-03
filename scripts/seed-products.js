import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Define Product Schema (simplified match with your existing schema)
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    salePrice: Number,
    category: String,
    images: [String],
    slug: { type: String, unique: true },
    stock: Number,
    isFeatured: Boolean,
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const CATEGORIES = ['Watch', 'Electronics', 'Drinkware', 'Bags', 'Accessories'];
const ADJECTIVES = ['Premium', 'Luxury', 'Modern', 'Sleek', 'Durable', 'Elegant', 'Classic', 'Urban', 'Tech', 'Minimalist'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5);
}

const dummyProducts = Array.from({ length: 100 }).map((_, i) => {
    const category = getRandomItem(CATEGORIES);
    const adjective = getRandomItem(ADJECTIVES);
    const title = `${adjective} ${category} ${i + 1}`;
    const price = Math.floor(Math.random() * 5000) + 1000;
    const isSale = Math.random() > 0.7;

    return {
        title,
        description: `Experience the best quality with our ${title}. This ${category.toLowerCase()} features a modern design, premium materials, and exceptional durability. Perfect for daily use.`,
        price,
        salePrice: isSale ? Math.floor(price * 0.8) : null,
        category,
        images: [`/images/products/placeholder.png`], // Placeholder image
        slug: generateSlug(title),
        stock: Math.floor(Math.random() * 50),
        isFeatured: Math.random() > 0.8,
    };
});

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        console.log('Clearing existing products...');
        await Product.deleteMany({}); // Optional: comment out if you want to append
        console.log('Existing products cleared.');

        console.log(`Seeding ${dummyProducts.length} products...`);
        await Product.insertMany(dummyProducts);
        console.log('Done!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
