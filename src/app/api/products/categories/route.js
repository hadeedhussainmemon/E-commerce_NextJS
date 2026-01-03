
import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/data';

export async function GET() {
    try {
        const result = await getCategories();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Categories API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
