import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

export async function POST(request) {
    try {
        await dbConnect();
        const { businessName } = await request.json();

        // Get token from cookie or header
        const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userId = payload.id;

        if (payload.role === 'superadmin') {
            return NextResponse.json({ error: 'Super Admin already has full access' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.role = 'seller';
        user.businessName = businessName || user.name;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'You are now a seller!',
            user: { id: user._id, name: user.name, role: user.role, businessName: user.businessName }
        });
    } catch (error) {
        console.error('Become Seller Error:', error);
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}
