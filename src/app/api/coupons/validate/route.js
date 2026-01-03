
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(request) {
    // Validate Coupon Endpoint
    try {
        await dbConnect();
        const { code, cartTotal } = await request.json();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
            return NextResponse.json({ isValid: false, message: 'Invalid or expired coupon' });
        }

        if (cartTotal < coupon.minPurchase) {
            return NextResponse.json({
                isValid: false,
                message: `Minimum purchase of Rs. ${coupon.minPurchase} required`
            });
        }

        return NextResponse.json({
            isValid: true,
            coupon: {
                code: coupon.code,
                type: coupon.discountType,
                amount: coupon.discountAmount
            }
        });

    } catch (error) {
        console.error('Coupon Validate Error:', error);
        return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
    }
}
