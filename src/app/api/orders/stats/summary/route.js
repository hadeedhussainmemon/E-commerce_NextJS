
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();

        const totalOrders = await Order.countDocuments();

        // Revenue (Sum of total field)
        const revenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

        // Mock Monthly Sales for Chart (Dynamic based on generic data)
        // In a real app, you would aggregate by createdAt date
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
            totalProfit: totalRevenue * 0.35, // Approx 35% margin
            pending: pendingOrders,
            delivered: deliveredOrders,
            monthlySales
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
