import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { jwtVerify } from 'jose';
import { sendOrderConfirmation, sendAdminNewOrderAlert } from '@/services/emailService';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

const generateOrderId = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

async function verifyToken(request) {
    try {
        let token;
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('adminToken')?.value;
        } catch (e) {
            // Prerender bailout
        }
        token = token || request.headers.get('authorization')?.split(' ')[1];
        if (!token) return null;
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

// GET /api/orders - Get all orders (admin only)
export async function GET(request) {
    try {
        await dbConnect();

        const payload = await verifyToken(request);
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const paymentStatus = searchParams.get('paymentStatus');

        const query = {};
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

        // Hydrate orders with latest product images
        const products = await Product.find({}, 'id image').lean();
        const productMap = new Map(products.map(p => [p.id, p.image]));

        const tagged = orders.map(o => {
            if (o.items && Array.isArray(o.items)) {
                o.items = o.items.map(item => ({
                    ...item,
                    image: productMap.get(item.productId) || item.image
                }));
            }
            return o;
        });

        return NextResponse.json(tagged);

    } catch (error) {
        console.error('getAllOrders error:', error);
        return NextResponse.json(
            { message: 'Error fetching orders', error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/orders - Place new order
export async function POST(request) {
    try {
        await dbConnect();

        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            postalCode,
            items,
            subtotal,
            shippingCost,
            giftWrap,
            giftWrapCost,
            giftMessage,
            total,
            notes,
            requestId,
            couponCode
        } = await request.json();

        // Validation
        if (!customerName || !customerPhone || !shippingAddress || !city || !items || items.length === 0) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Idempotency check
        if (requestId) {
            const existingOrder = await Order.findOne({ requestId });
            if (existingOrder) {
                return NextResponse.json(existingOrder, { status: 201 });
            }
        }

        // Validate coupon if provided
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon && coupon.isValid()) {
                if (coupon.discountType === 'percentage') {
                    discountAmount = (subtotal * coupon.discountValue) / 100;
                } else {
                    discountAmount = coupon.discountValue;
                }
                // Increment usage count
                coupon.usedCount = (coupon.usedCount || 0) + 1;
                await coupon.save();
            }
        }

        const orderId = generateOrderId();
        const orderData = {
            id: orderId,
            customerName,
            customerEmail: customerEmail || '',
            customerPhone,
            shippingAddress,
            city,
            postalCode,
            items,
            subtotal: subtotal || 0,
            shippingCost: shippingCost || 0,
            giftWrap: giftWrap || false,
            giftWrapCost: giftWrapCost || 0,
            giftMessage: giftMessage || '',
            total: total || 0,
            couponCode: couponCode || null,
            discountAmount,
            notes: notes || '',
            status: 'pending',
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            requestId: requestId || null
        };

        const order = new Order(orderData);
        await order.save();

        // Send confirmation emails
        await sendOrderConfirmation(order);
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
        if (adminEmails.length > 0) {
            await sendAdminNewOrderAlert(order, adminEmails);
        }

        return NextResponse.json(order, { status: 201 });

    } catch (error) {
        console.error('placeOrder error:', error);
        return NextResponse.json(
            { message: 'Error placing order', error: error.message },
            { status: 500 }
        );
    }
}
