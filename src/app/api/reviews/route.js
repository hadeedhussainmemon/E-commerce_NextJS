import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

async function verifyToken(request) {
    try {
        let token;
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('adminToken')?.value;
        } catch (e) {
            // Prerender bailout
        }
        token = token || request.headers.get('authorization')?.split(' ')[1];
        if (!token) return null;
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

// GET /api/reviews - Get all reviews with filters
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const payload = await verifyToken(request);
        const query = {};

        // Non-admin users only see approved reviews
        if (!payload) {
            query.status = 'approved';
        } else if (status) {
            query.status = status;
        }

        const reviews = await Review.find(query).sort({ createdAt: -1 });
        return NextResponse.json(reviews);

    } catch (error) {
        console.error('getAllReviews error:', error);
        return NextResponse.json(
            { message: 'Error fetching reviews', error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/reviews - Submit a new review (public)
export async function POST(request) {
    try {
        await dbConnect();
        const { name, email, productPurchased, rating, review } = await request.json();

        // Validation
        if (!name || !email || !rating || !review) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (review.length < 20) {
            return NextResponse.json(
                { message: 'Review must be at least 20 characters' },
                { status: 400 }
            );
        }

        const newReview = new Review({
            name,
            email,
            productPurchased: productPurchased || '',
            rating: Math.min(Math.max(parseInt(rating), 1), 5),
            review,
            status: 'pending'
        });

        await newReview.save();
        return NextResponse.json(newReview, { status: 201 });

    } catch (error) {
        console.error('submitReview error:', error);
        return NextResponse.json(
            { message: 'Error submitting review', error: error.message },
            { status: 500 }
        );
    }
}
