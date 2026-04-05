import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

export async function GET(request) {
    try {
        await dbConnect();

        // Auth check
        let token;
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('adminToken')?.value;
        } catch (e) {
            // Prerender bailout or missing context
        }
        token = token || request.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, SECRET_KEY);

        let query = {};
        if (payload.role === 'seller') {
            query['items.sellerId'] = payload.id;
        }

        const totalOrders = await Order.countDocuments(query);

        // Revenue (Sum of items matching sellerId)
        let totalRevenue = 0;
        if (payload.role === 'seller') {
            const revenueAgg = await Order.aggregate([
                { $match: { 'items.sellerId': payload.id } },
                { $unwind: "$items" },
                { $match: { 'items.sellerId': payload.id } },
                { $group: { _id: null, total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } }
            ]);
            totalRevenue = revenueAgg[0]?.total || 0;
        } else {
            const revenueAgg = await Order.aggregate([
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]);
            totalRevenue = revenueAgg[0]?.total || 0;
        }

        const pendingOrders = await Order.countDocuments({ ...query, status: 'pending' });
        const confirmedOrders = await Order.countDocuments({ ...query, status: 'confirmed' });
        const processingOrders = await Order.countDocuments({ ...query, status: 'processing' });
        const shippedOrders = await Order.countDocuments({ ...query, status: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ ...query, status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ ...query, status: 'cancelled' });

        const monthlySales = [
            { name: 'Jan', value: totalRevenue * 0.05 },
            { name: 'Feb', value: totalRevenue * 0.08 },
            { name: 'Mar', value: totalRevenue * 0.07 },
            { name: 'Apr', value: totalRevenue * 0.1 },
            { name: 'May', value: totalRevenue * 0.1 },
            { name: 'Jun', value: totalRevenue * 0.15 },
            { name: 'Jul', value: totalRevenue * 0.2 },
            { name: 'Aug', value: totalRevenue * 0.25 },
        ];

        return NextResponse.json({
            total: totalOrders,
            totalRevenue,
            totalProfit: totalRevenue * 0.35,
            pending: pendingOrders,
            confirmed: confirmedOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
            monthlySales
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
