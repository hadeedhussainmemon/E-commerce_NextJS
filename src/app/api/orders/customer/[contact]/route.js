
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
    try {
        const { contact } = await params; // This is the dynamic route param
        await dbConnect();

        if (!contact) {
            return NextResponse.json([]);
        }

        const decodedContact = decodeURIComponent(contact).trim();

        // Search by email or phone in the 'customer' object
        const orders = await Order.find({
            $or: [
                { 'customer.email': decodedContact },
                { 'customer.phone': decodedContact },
                // Also match strictly if frontend sends raw phone
                { 'customer.phone': { $regex: decodedContact, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        return NextResponse.json(orders);

    } catch (error) {
        console.error('Customer Orders API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
