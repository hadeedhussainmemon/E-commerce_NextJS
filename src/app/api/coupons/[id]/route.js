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

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const payload = await verifyAuth(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const coupon = await Coupon.findById(id);
        if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });

        // Authorization check
        if (payload.role === 'seller' && coupon.sellerId !== payload.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this coupon' }, { status: 403 });
        }

        await Coupon.deleteOne({ _id: id });
        return NextResponse.json({ success: true, message: 'Coupon deleted' });
    } catch (error) {
        console.error('Delete Coupon Error:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
