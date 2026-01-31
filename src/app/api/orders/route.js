import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('pageSize')) || 10;
        const page = parseInt(searchParams.get('page')) || 1;
        const status = searchParams.get('status');

        // Auth check
        const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, SECRET_KEY);

        let query = {};
        if (status && status !== 'All' && status !== 'all') {
            query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }

        // Seller isolation: filter orders that contain at least one item from this seller
        if (payload.role === 'seller') {
            query['items.sellerId'] = payload.id;
        } else if (payload.role === 'superadmin') {
            const filterSellerId = searchParams.get('sellerId');
            if (filterSellerId) {
                query['items.sellerId'] = filterSellerId;
            }
        } else {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        // If seller, we might want to filter the items shown in the order too?
        // or just show the whole order if it belongs to them.
        // Usually, a seller should only see THEIR items in a multi-seller order.
        let processedOrders = orders;
        if (payload.role === 'seller') {
            processedOrders = orders.map(order => {
                const orderObj = order.toObject();
                orderObj.items = orderObj.items.filter(item => item.sellerId === payload.id);
                // Adjust total to only reflect this seller's items?
                // This is a design decision. Let's keep the items filter for now.
                orderObj.total = orderObj.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return orderObj;
            });
        }

        const total = await Order.countDocuments(query);

        return NextResponse.json({
            orders: processedOrders,
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

        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Populate sellerId for each item by fetching product
        const itemsWithSeller = await Promise.all(body.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            return {
                ...item,
                sellerId: product?.sellerId || 'admin'
            };
        }));

        const order = await Order.create({
            customer: body.customer,
            items: itemsWithSeller,
            total: body.total,
            status: 'pending'
        });

        return NextResponse.json({ success: true, orderId: order._id, message: 'Order placed successfully' }, { status: 201 });

    } catch (error) {
        console.error('Order API Error:', error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}
