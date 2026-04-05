import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

// Next.js 16.2 Modern Proxy Pattern (formerly middleware)
export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // 1. Protect /admin routes (except login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('adminToken')?.value;

        if (!token) {
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }

        try {
            await jwtVerify(token, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            console.error('Proxy Auth Error:', error);
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
