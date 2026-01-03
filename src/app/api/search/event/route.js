
import { NextResponse } from 'next/server';

export async function POST(request) {
    // Just accept the log and return success (fire and forget)
    // You could connect this to a 'SearchLog' model if you want analytics
    return NextResponse.json({ success: true });
}
