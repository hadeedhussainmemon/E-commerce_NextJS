import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

// Super Admin Credentials from env
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request) {
    try {
        await dbConnect();
        const { username, password } = await request.json();

        // 1. Check Super Admin (from env)
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            const token = await new SignJWT({
                role: 'superadmin',
                id: 'admin'
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(SECRET_KEY);

            const response = NextResponse.json({
                success: true,
                user: { name: 'Super Admin', role: 'superadmin' },
                token
            });

            response.cookies.set('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            return response;
        }

        // 2. Check Sellers (from DB)
        const user = await User.findOne({
            $or: [{ email: username }, { businessName: username }],
            role: 'seller'
        });

        if (user) {
            const [salt, storedHash] = user.password.split(':');
            const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

            if (hash === storedHash) {
                const token = await new SignJWT({
                    role: 'seller',
                    id: user._id.toString()
                })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('24h')
                    .sign(SECRET_KEY);

                const response = NextResponse.json({
                    success: true,
                    user: { name: user.name, role: 'seller', businessName: user.businessName },
                    token
                });

                response.cookies.set('adminToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24,
                    path: '/',
                });

                return response;
            }
        }

        return NextResponse.json({ error: 'Invalid credentials or access denied' }, { status: 401 });
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
