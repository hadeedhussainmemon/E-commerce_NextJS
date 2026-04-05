import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

async function verifyAuth(request) {
    let token;
    try {
        const cookieStore = await cookies();
        token = cookieStore.get('adminToken')?.value;
    } catch (e) {
        // Prerender bailout
    }
    token = token || request.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch {
        return null;
    }
}

// GET /api/coupons - Get all coupons (admin only)
export async function GET(request) {
    try {
        await dbConnect();
        const payload = await verifyAuth(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('getAllCoupons error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

// POST /api/coupons - Create new coupon (admin only)
export async function POST(request) {
    try {
        await dbConnect();
        const payload = await verifyAuth(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit } = await request.json();

        // Validation
        if (!code || !discountType || !discountValue || !expiryDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check for existing code
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return NextResponse.json(
                { error: 'Coupon code already exists' },
                { status: 400 }
            );
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountType,
            discountValue: Number(discountValue),
            minOrderAmount: Number(minOrderAmount || 0),
            expiryDate: new Date(expiryDate),
            usageLimit: usageLimit ? Number(usageLimit) : null,
            isActive: true
        });

        await coupon.save();
        return NextResponse.json(coupon, { status: 201 });

    } catch (error) {
        console.error('createCoupon error:', error);
        return NextResponse.json(
            { error: 'Failed to create coupon', details: error.message },
            { status: 500 }
        );
    }
}
