
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('pageSize')) || 10;
        const page = parseInt(searchParams.get('page')) || 1;
        const status = searchParams.get('status');

        let query = {};
        if (status && status !== 'All' && status !== 'all') {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Order.countDocuments(query);

        return NextResponse.json({
            orders, // Some frontends expect array directly, but admin often wants pagination metadata
            // If the Admin component expects array directly, we might need to adjust.
            // But usually pagination implies this structure.
            // Let's check AdminOrders.optimized.jsx usage.
            // It calls /api/orders?page=...
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error('Orders API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Validate basics
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Create Order
        const order = await Order.create({
            customer: body.customer,
            items: body.items,
            total: body.total,
            status: 'Pending'
        });

        return NextResponse.json({ success: true, orderId: order._id, message: 'Order placed successfully' }, { status: 201 });

    } catch (error) {
        console.error('Order API Error:', error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}
