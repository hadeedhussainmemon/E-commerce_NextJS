import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Define Product Schema
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    salePrice: Number,
    category: String,
    image: String,
    images: [String],
    slug: { type: String, unique: true },
    stock: Number,
    isFeatured: Boolean,
    isVisible: Boolean,
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Helper function to format category name from folder name
function formatCategory(folderName) {
    return folderName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper function to generate title from filename
function formatTitle(filename) {
    const nameWithoutExt = path.parse(filename).name;
    return nameWithoutExt
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper function to generate slug
function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5);
}

// Helper function to scan directory and generate products
function scanAndGenerateProducts() {
    const baseDir = path.resolve(__dirname, '../public/images/products');
    const products = [];

    if (!fs.existsSync(baseDir)) {
        console.error(`Directory not found: ${baseDir}`);
        return [];
    }

    const folders = fs.readdirSync(baseDir).filter(file => fs.statSync(path.join(baseDir, file)).isDirectory());

    folders.forEach(folder => {
        const categoryName = formatCategory(folder);
        const folderPath = path.join(baseDir, folder);
        const files = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(file));

        files.forEach(file => {
            const title = formatTitle(file);
            const basePrice = ['Electronics', 'Watches'].includes(categoryName) ? 5000 : 1000;
            const price = Math.floor(Math.random() * 5000) + basePrice;
            const isSale = Math.random() > 0.7;
            const imagePath = `/images/products/${folder}/${file}`;

            products.push({
                title: title,
                description: `Experience the premium quality of our ${title}. This item from our ${categoryName} collection is designed with attention to detail and style. Perfect for yourself or as a gift.`,
                price: price,
                salePrice: isSale ? Math.floor(price * 0.85) : null,
                category: categoryName,
                image: imagePath,
                images: [imagePath],
                slug: generateSlug(title),
                stock: Math.floor(Math.random() * 100) + 5,
                isFeatured: Math.random() > 0.85,
                isVisible: true
            });
        });
    });

    return products;
}

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Existing products cleared.');

        console.log('Scanning directories for product images...');
        const products = scanAndGenerateProducts();

        if (products.length === 0) {
            console.warn('No products found in public/images/products. Please check if the images exist.');
            process.exit(1);
        }

        console.log(`Found ${products.length} products. Seeding database...`);
        await Product.insertMany(products);
        console.log('Successfully seeded database!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
