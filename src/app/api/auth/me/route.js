import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

export async function GET(request) {
    try {
        await dbConnect();

        const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, SECRET_KEY);

        if (payload.role === 'superadmin') {
            return NextResponse.json({
                user: { id: 'admin', name: 'Super Admin', role: 'superadmin' }
            });
        }

        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Me API Error:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
