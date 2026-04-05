
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

// POST /api/coupons/validate - Validate coupon code (public)
export async function POST(request) {
    try {
        await dbConnect();
        const { code, cartTotal } = await request.json();

        if (!code) {
            return NextResponse.json(
                { message: 'Coupon code is required' },
                { status: 400 }
            );
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return NextResponse.json(
                { message: 'Invalid coupon code' },
                { status: 404 }
            );
        }

        if (!coupon.isValid()) {
            return NextResponse.json(
                { message: 'Coupon is expired or inactive' },
                { status: 400 }
            );
        }

        if (cartTotal !== undefined && coupon.minOrderAmount > 0 && cartTotal < coupon.minOrderAmount) {
            return NextResponse.json({
                message: `Minimum order amount of ${coupon.minOrderAmount} PKR required`
            }, { status: 400 });
        }

        // Calculate discount amount for preview
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > cartTotal) discountAmount = cartTotal;

        return NextResponse.json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            isUsageLimit: coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit
        });

    } catch (error) {
        console.error('validateCoupon error:', error);
        return NextResponse.json(
            { message: 'Error validating coupon', error: error.message },
            { status: 500 }
        );
    }
}
