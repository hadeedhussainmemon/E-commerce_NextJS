import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Review from '@/models/Review';

/**
 * Get all products with filters (Storefront & Admin)
 */
export async function getProducts(filters = {}) {
    'use cache';
    await dbConnect();

    const {
        category,
        sort,
        q,
        limit = 100,
        page = 1,
        showHidden = false,
        sellerId = null
    } = filters;

    let query = {};

    // Seller Filter
    if (sellerId) {
        query.sellerId = sellerId;
    }

    // Visibility Filter (Default: Only show visible)
    if (!showHidden) {
        query.isVisible = true;
    }

    // Filter by Category
    if (category && category !== 'All') {
        const decodedCategory = decodeURIComponent(category).toLowerCase();
        query.category = { $regex: new RegExp(`^${decodedCategory}$`, 'i') };
    }

    // Filter by Search Query
    if (q) {
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
        ];
    }

    let productsQuery = Product.find(query);

    // Pagination
    const skip = (page - 1) * limit;
    productsQuery = productsQuery.skip(skip).limit(parseInt(limit));

    // Sorting
    if (sort === 'priceAsc') {
        productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'priceDesc') {
        productsQuery = productsQuery.sort({ price: -1 });
    } else if (sort === 'newest') {
        productsQuery = productsQuery.sort({ createdAt: -1 });
    } else {
        productsQuery = productsQuery.sort({ isFeatured: -1, createdAt: -1 });
    }

    const products = await productsQuery.lean().exec(); 
    const total = await Product.countDocuments(query);

    // Foolproof serialization for Next.js Server Components
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return {
        products: serializedProducts || [],
        total: total || 0,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit) || 1
    };
}

/**
 * Get a single product by slug or ID
 */
export async function getProduct(idOrSlug) {
    'use cache';
    if (!idOrSlug) return null;
    await dbConnect();

    let product;
    // Check if it's a numeric ID (some products in this DB use numbers as IDs)
    if (!isNaN(idOrSlug)) {
        product = await Product.findOne({ id: Number(idOrSlug) }).lean();
    } else {
        product = await Product.findOne({ slug: idOrSlug }).lean();
    }

    if (!product) {
        // Final fallback: try finding by internal _id if it looks like one
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(idOrSlug).lean();
        }
    }

    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
}

/**
 * Get all categories with counts
 */
export async function getCategories() {
    'use cache';
    await dbConnect();

    const categories = await Product.aggregate([
        {
            $group: {
                _id: { $toLower: "$category" },
                originalName: { $first: "$category" },
                count: { $sum: 1 },
                image: { $first: "$image" }
            }
        },
        {
            $project: {
                _id: 0,
                name: "$originalName",
                count: 1,
                image: 1
            }
        },
        { $sort: { count: -1 } }
    ]);

    const serializedCategories = JSON.parse(JSON.stringify(categories));
    return { categories: serializedCategories || [] };
}

/**
 * Get orders with filtering (Admin)
 */
export async function getOrders(filters = {}) {
    await dbConnect();

    const { limit = 50, page = 1, status } = filters;
    let query = {};
    if (status && status !== 'all') {
        query.status = status;
    }

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const total = await Order.countDocuments(query);

    return {
        orders: JSON.parse(JSON.stringify(orders)) || [],
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit) || 1
    };
}

/**
 * Get high-level stats for the Admin Dashboard
 */
export async function getAdminStats() {
    await dbConnect();

    // Parallel fetch for speed
    const [
        totalProducts,
        totalOrders,
        pendingOrders,
        revenueResult
    ] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ])
    ]);

    return {
        totalProducts,
        totalOrders,
        pendingOrders,
        revenue: revenueResult[0]?.total || 0,
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Get reviews (Storefront & Admin)
 */
export async function getReviews(filters = {}) {
    'use cache';
    await dbConnect();
    const { status = 'approved', limit = 20 } = filters;
    
    let query = {};
    if (status !== 'all') {
        query.status = status;
    }

    const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return JSON.parse(JSON.stringify(reviews));
}
