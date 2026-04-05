import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

async function verifyToken() {
    try {
        let token;
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('adminToken')?.value;
        } catch (e) {
            // Prerender bailout
        }
        if (!token) return null;
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

// GET /api/orders/:id - Get single order
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const order = await Order.findOne({ id }).lean();
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error('getOrder error:', error);
        return NextResponse.json(
            { message: 'Error fetching order', error: error.message },
            { status: 500 }
        );
    }
}

// PATCH /api/orders/:id - Update order status (admin only)
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const payload = await verifyToken(request);
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const { status, paymentStatus, notes } = await request.json();

        const order = await Order.findOne({ id });
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (notes) order.notes = notes;

        order.updatedAt = new Date();
        await order.save();

        return NextResponse.json(order);

    } catch (error) {
        console.error('updateOrder error:', error);
        return NextResponse.json(
            { message: 'Error updating order', error: error.message },
            { status: 500 }
        );
    }
}
