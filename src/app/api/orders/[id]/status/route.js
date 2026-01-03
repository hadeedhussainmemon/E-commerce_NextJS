
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const { status } = await request.json();

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error('Update Status Error:', error);
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }
}

// Some frontends use PATCH for status
export async function PATCH(req, ctx) { return PUT(req, ctx); }
