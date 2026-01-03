
import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Trending Searches
    // In a real app, you would log searches to a DB and aggregate them here.
    const trending = [
        "Watch",
        "Headphones",
        "Shoes",
        "Wireless",
        "Gaming",
        "Wallet",
        "Perfume",
        "Sunglasses"
    ];

    return NextResponse.json(trending);
}
