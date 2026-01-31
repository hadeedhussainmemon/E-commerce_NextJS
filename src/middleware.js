
import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Middleware is deprecated in Next.js 16, but keeping minimal logic
    // Admin auth is handled client-side in the admin page component
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
