import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function getProducts(filters = {}) {
    await dbConnect();

    const {
        category,
        sort,
        q,
        limit = 100,
        page = 1, // Default to page 1 if not provided, though not strictly used in the limit-based query in original code, adding for future proofing or strictly following original logic which just used limit.
        showHidden = false
    } = filters;

    let query = {};

    // Visibility Filter (Default: Only show visible)
    if (!showHidden) {
        query.isVisible = true;
    }

    // Filter by Category
    if (category && category !== 'All') {
        const decodedCategory = decodeURIComponent(category).toLowerCase();
        query.category = { $elemMatch: { $regex: new RegExp(`^${decodedCategory}$`, 'i') } };
        // Fallback or alternative logic from original file:
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

    // If limit is provided, use it. The original code used .limit(limit).
    // It didn't seem to implement full pagination (skip) in the GET route I saw, just limit.
    if (limit) {
        productsQuery = productsQuery.limit(parseInt(limit));
    }

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

    const products = await productsQuery.lean().exec(); // Use lean() for better performance and plain objects
    const total = await Product.countDocuments(query);

    // Convert _id to string to avoid serialization issues in Next.js Server Components
    const serializedProducts = products.map(product => ({
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
    }));

    return {
        products: serializedProducts,
        total,
        page: 1, // Hardcoded in original
        totalPages: 1 // Hardcoded in original
    };
}

export async function getCategories() {
    await dbConnect();

    const categories = await Product.aggregate([
        {
            $group: {
                _id: { $toLower: "$category" },
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

    return { categories };
}
