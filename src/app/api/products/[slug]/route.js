
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { Buffer } from 'buffer';

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        await dbConnect();

        let product;

        if (mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findById(slug);
        }

        if (!product) {
            product = await Product.findOne({ slug: slug });
        }

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);

    } catch (error) {
        console.error('Product API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { slug } = await params;
        await dbConnect();

        const contentType = request.headers.get('content-type') || '';
        let body = {};

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const imageFile = formData.get('image');

            for (const [key, value] of formData.entries()) {
                if (key !== 'image') {
                    if (key === 'colors' || key === 'category') {
                        // Split comma separated strings into arrays
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

            // Allow slug update if title update? or keep stable URLs?
            // Let's assume slug updates are manual if needed, or tied to title.
            // For now, let's not auto-update slug on PUT to avoid breaking links, 
            // unless we want to strict sync it.
            // If body.slug is sent, use it.
            if (!body.slug && body.title) {
                // Optional: Auto-update logic if you want
                // body.slug = ...
            }

            if (imageFile && imageFile instanceof Blob) {
                const buffer = Buffer.from(await imageFile.arrayBuffer());
                body.image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
            } else if (typeof imageFile === 'string' && imageFile) {
                body.image = imageFile;
            }
        } else {
            body = await request.json();
        }

        let product;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findByIdAndUpdate(slug, body, { new: true, runValidators: true });
        }

        if (!product) {
            product = await Product.findOneAndUpdate({ slug: slug }, body, { new: true, runValidators: true });
        }

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Update Product Error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function PATCH(request, context) {
    return PUT(request, context);
}

export async function DELETE(request, { params }) {
    try {
        const { slug } = await params;
        await dbConnect();

        let product;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findByIdAndDelete(slug);
        } else {
            product = await Product.findOneAndDelete({ slug: slug });
        }

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
