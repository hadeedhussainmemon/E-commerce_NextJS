import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { jwtVerify } from 'jose';
import { productSlug } from '@/lib/slug';
import { mapQueryToSlugs, mapTokensToSlugs } from '@/lib/synonyms';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-prod'
);

import { getProducts } from '@/lib/data';

// GET /api/products - Get all products with filters (Refactored to use lib/data)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const options = {
            page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
            limit: Math.min(48, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10))),
            search: searchParams.get('q') || searchParams.get('search') || '',
            category: searchParams.get('categories') || searchParams.get('category') || '',
            sort: searchParams.get('sort') || 'newest',
            minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
            maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
            inStock: searchParams.get('inStock')?.toLowerCase() === 'true',
            showHidden: searchParams.get('showHidden')?.toLowerCase() === 'true'
        };

        const { products, total } = await getProducts(options);

        const response = NextResponse.json({
            products,
            total,
            page: options.page,
            pageSize: options.limit,
            hasMore: (options.page * options.limit) < total
        });
        
        response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        return response;

    } catch (error) {
        console.error('API GET /api/products error:', error);
        return NextResponse.json(
            { message: 'Error fetching products', error: error.message },
            { status: 500 }
        );
    }
}
// Helper to verify JWT token
async function verifyAuth(request) {
    let token;
    try {
        const cookieStore = await cookies();
        token = cookieStore.get('adminToken')?.value;
    } catch (e) {
        // Prerender bailout
    }
    try {
        token = token || request.headers.get('authorization')?.split(' ')[1];
        if (!token) return null;
        
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

// POST /api/products - Create new product (admin only)
export async function POST(request) {
    try {
        await dbConnect();

        // Verify admin token
        const payload = await verifyToken(request);
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const { title, price, description, category, material, stock, isCustomizable, colors, isVisible } = Object.fromEntries(formData);

        // Validation
        if (!title || !price || !description || !category) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Get next product ID
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const nextId = (lastProduct?.id || 0) + 1;

        // Parse fields
        const parsedColors = typeof colors === 'string' && colors.trim().length
            ? colors.split(',').map(s => s.trim()).filter(Boolean)
            : (Array.isArray(colors) ? colors : []);

        let categoryArray = [];
        if (typeof category === 'string') {
            categoryArray = category.split(',').map(c => c.trim()).filter(Boolean);
        } else if (Array.isArray(category)) {
            categoryArray = category;
        }

        // Handle image
        const imageFile = formData.get('image');
        let imageUrl = '';
        
        if (imageFile && imageFile instanceof File) {
            // In production, upload to Cloudinary or similar
            // For now, use placeholder or base64
            const buffer = await imageFile.arrayBuffer();
            imageUrl = `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
        }

        const newProduct = new Product({
            id: nextId,
            title,
            price: parseFloat(price),
            description,
            image: imageUrl,
            category: categoryArray,
            material: material || '',
            stock: parseInt(stock) || 0,
            colors: parsedColors,
            isCustomizable: isCustomizable === 'true' || isCustomizable === true,
            isVisible: isVisible === undefined ? true : (isVisible === 'true' || isVisible === true)
        });

        newProduct.slug = productSlug(newProduct);
        await newProduct.save();

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        console.error('addProduct error:', error);
        return NextResponse.json(
            { message: 'Error adding product', error: error.message },
            { status: 500 }
        );
    }
}
