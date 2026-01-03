
import { NextResponse } from 'next/server';

export async function POST(request) {
    // Logging endpoint for analytics
    return NextResponse.json({ success: true });
}
