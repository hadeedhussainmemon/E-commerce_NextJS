
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic validation
        if (!body.productId || !body.rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const review = await Review.create({
            productId: body.productId,
            user: body.user, // { name, email }
            rating: body.rating,
            comment: body.comment,
            images: body.images || [],
            status: 'Pending' // Requires admin approval usually
        });

        return NextResponse.json(review, { status: 201 });

    } catch (error) {
        console.error('Create Review Error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}

export async function GET(request) {
    // List reviews for a product
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const status = searchParams.get('status');

        let query = {};
        if (productId) query.productId = productId;
        if (status) query.status = status;
        // Public usually only sees Approved
        if (!status && !request.headers.get('Authorization')) {
            query.status = 'Approved';
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 });
        return NextResponse.json(reviews);

    } catch (error) {
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
