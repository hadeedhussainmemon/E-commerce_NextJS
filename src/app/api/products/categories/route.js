
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // Get distinct categories
        // Note: Using distinct returns just strings. The frontend expects objects { name, count }.
        // So we use aggregate.
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: { $toLower: "$category" }, // Group by lowercase to avoid duplicates like "Watch" vs "watch"
                    originalName: { $first: "$category" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$originalName",
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);

        return NextResponse.json({ categories });

    } catch (error) {
        console.error('Categories API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
