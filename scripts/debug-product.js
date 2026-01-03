import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const product = await Product.findOne().lean();
    console.log('Product:', JSON.stringify(product, null, 2));

    // Check aggregation
    try {
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: { $toLower: "$category" },
                    originalName: { $first: "$category" },
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log('Aggregation result:', categories);
    } catch (e) {
        console.error('Aggregation error:', e.message);
    }

    process.exit(0);
}

check();
