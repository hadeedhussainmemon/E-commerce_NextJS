
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { Buffer } from 'buffer';
import { getProducts } from '@/lib/data';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            category: searchParams.get('category'),
            sort: searchParams.get('sort'),
            q: searchParams.get('q'),
            limit: searchParams.get('limit'),
            showHidden: searchParams.get('showHidden') === 'true'
        };

        const result = await getProducts(filters);

        return NextResponse.json(result);

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
