
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { mapQueryToSlugs, mapTokensToSlugs } from '@/lib/synonyms';

function escapeRegExp(input) {
    return String(input || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenize(input) {
    return String(input || '')
        .toLowerCase()
        .split(/\s+/)
        .map(s => s.trim())
        .filter(Boolean);
}

function toSlugLike(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// GET /api/products/categories - Get all categories
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const q = (searchParams.get('q') || '').trim();
        const tokens = tokenize(q).slice(0, 6);
        const slugHints = Array.from(new Set([
            ...mapQueryToSlugs(q),
            ...mapTokensToSlugs(tokens)
        ]))
            .map(toSlugLike)
            .filter(Boolean);

        const pipeline = [
            { $unwind: "$category" },
            {
                $group: {
                    _id: { $toLower: "$category" },
                    originalName: { $first: "$category" },
                    count: { $sum: 1 },
                    image: { $first: "$image" }
                }
            }
        ];

        if (q) {
            const qPattern = escapeRegExp(q.toLowerCase());
            const tokenPatterns = tokens.map(t => escapeRegExp(t));

            pipeline.push({
                $addFields: {
                    categorySlug: {
                        $replaceAll: {
                            input: '$_id',
                            find: ' ',
                            replacement: '-'
                        }
                    },
                    searchScore: {
                        $add: [
                            { $cond: [{ $regexMatch: { input: '$_id', regex: `^${qPattern}$` } }, 30, 0] },
                            { $cond: [{ $regexMatch: { input: '$_id', regex: `^${qPattern}` } }, 16, 0] },
                            { $cond: [{ $regexMatch: { input: '$_id', regex: qPattern } }, 8, 0] },
                            {
                                $cond: [
                                    { $in: ['$categorySlug', slugHints] },
                                    12,
                                    0
                                ]
                            },
                            ...tokenPatterns.map(pattern => ({
                                $cond: [{ $regexMatch: { input: '$_id', regex: pattern } }, 4, 0]
                            }))
                        ]
                    }
                }
            });

            pipeline.push({ $match: { searchScore: { $gt: 0 } } });
            pipeline.push({ $sort: { searchScore: -1, count: -1, originalName: 1 } });
            pipeline.push({ $limit: 12 });
        } else {
            pipeline.push({ $sort: { count: -1, originalName: 1 } });
        }

        const categories = await Product.aggregate(pipeline);

        const payload = categories.map(c => ({
            name: c.originalName,
            slug: String(c.originalName).toLowerCase().replace(/\s+/g, '-'),
            count: c.count,
            image: c.image || '/og-image.jpg'
        }));

        const response = NextResponse.json({ categories: payload });
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
        return response;

    } catch (error) {
        console.error('getCategories error:', error);
        return NextResponse.json({ categories: [] }, { status: 500 });
    }
}
