import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// GET /api/products/trending-searches - Get trending categories
export async function GET(request) {
    try {
        await dbConnect();

        const result = await Product.aggregate([
            { $unwind: "$category" },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const terms = result.map(r => r._id)
            .filter(c => c && c.trim())
            .map(c => String(c).replace(/[-_]+/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

        const response = NextResponse.json({ terms: terms.slice(0, 8) });
        response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
        return response;

    } catch (e) {
        console.error('getTrendingSearches error:', e);
        return NextResponse.json({ terms: [] }, { status: 500 });
    }
}
