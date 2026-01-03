
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { Buffer } from 'buffer';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const sort = searchParams.get('sort');
        const q = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit')) || 100;
        const showHidden = searchParams.get('showHidden') === 'true';

        let query = {};

        // Visibility Filter (Default: Only show visible)
        if (!showHidden) {
            query.isVisible = true;
        }

        // Filter by Category
        if (category && category !== 'All') {
            const decodedCategory = decodeURIComponent(category).toLowerCase();
            // Match any element in the array that matches regex
            query.category = { $elemMatch: { $regex: new RegExp(`^${decodedCategory}$`, 'i') } };
            // Note: If category is stored as array of strings, simple regex also works:
            // query.category = { $regex: new RegExp(`^${decodedCategory}$`, 'i') }; 
            // Mongoose applies it to elements. But let's stick to simple regex on the field which Mongoose forwards.
            query.category = { $regex: new RegExp(`^${decodedCategory}$`, 'i') };
        }

        // Filter by Search Query
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ];
        }

        let productsQuery = Product.find(query).limit(limit);

        // Sorting
        if (sort === 'priceAsc') {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === 'priceDesc') {
            productsQuery = productsQuery.sort({ price: -1 });
        } else if (sort === 'newest') {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        } else {
            productsQuery = productsQuery.sort({ isFeatured: -1, createdAt: -1 });
        }

        const products = await productsQuery.exec();
        const total = await Product.countDocuments(query);

        return NextResponse.json({
            products,
            total,
            page: 1,
            totalPages: 1
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        const formData = await request.formData();
        const body = {};
        const imageFile = formData.get('image');

        // Convert FormData to Object with Type Conversion
        for (const [key, value] of formData.entries()) {
            if (key !== 'image') {
                if (key === 'colors' || key === 'category') {
                    // Convert "Red, Blue" -> ["Red", "Blue"]
                    body[key] = value.split(',').map(c => c.trim()).filter(Boolean);
                } else if (key === 'isCustomizable' || key === 'isVisible' || key === 'isFeatured') {
                    body[key] = value === 'true';
                } else if (key === 'price' || key === 'stock' || key === 'purchasePrice') {
                    body[key] = Number(value);
                } else {
                    body[key] = value;
                }
            }
        }

        // Generate Slug
        if (body.title && !body.slug) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }

        // Handle Image Upload (Base64 Fallback)
        if (imageFile && imageFile instanceof Blob) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            body.image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        } else if (typeof imageFile === 'string' && imageFile) {
            body.image = imageFile;
        }

        const product = await Product.create(body);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
