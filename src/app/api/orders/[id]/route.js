
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();

        // The frontend might pass "clean" ID or just ID. 
        // Mongoose expects ObjectId usually, but findById can handle hex strings.
        // Sometimes custom order IDs (strings) are used. 
        // The frontend code showed `fetch(${API_BASE_URL} /api/orders / ${orderId.trim()})`

        // Check if valid ObjectId
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error('Order API Error:', error);
        // Fallback search by string ID if you implement custom IDs
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

// Allow deleting orders? Admin might want to.
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        await Order.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
