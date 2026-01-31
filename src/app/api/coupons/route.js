import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

async function verifyAuth(request) {
    const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch {
        return null;
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const payload = await verifyAuth(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let query = {};
        if (payload.role === 'seller') {
            query.sellerId = payload.id;
        }

        const coupons = await Coupon.find(query).sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Coupons API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const payload = await verifyAuth(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Ensure discountAmount is mapped correctly from discountValue if needed
        const couponData = {
            ...body,
            discountAmount: Number(body.discountValue),
            minPurchase: Number(body.minOrderAmount),
            sellerId: payload.role === 'seller' ? payload.id : (body.sellerId || 'admin')
        };

        const coupon = await Coupon.create(couponData);
        return NextResponse.json(coupon, { status: 201 });
    } catch (error) {
        console.error('Create Coupon Error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}
