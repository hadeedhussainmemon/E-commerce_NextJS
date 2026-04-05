import React from 'react';
import { getProducts } from '@/lib/data';
import CategoryPage from '@/components/store/Category/CategoryPage';
import config from '@/config';

// Server-side fetch for metadata
export async function generateMetadata({ params }) {
    const { category: slug } = await params;
    const decodedCategory = decodeURIComponent(slug).replace(/-/g, ' ');

    return {
        title: `${decodedCategory.toUpperCase()} | ${config.appName}`,
        description: `Shop our latest collection of ${decodedCategory} at ${config.appName}. Curated for style and elegance.`,
        openGraph: {
            title: `${decodedCategory} - ${config.appName} Collection`,
            description: `Browse the finest ${decodedCategory} at ${config.appName}.`,
            type: 'website',
        },
    };
}



export default async function CategoryPageRoute({ params }) {
    const { category: slug } = await params;
    const decodedCategory = decodeURIComponent(slug).replace(/-/g, ' ');

    // ⚡ Performance: Fetch products on server for instant hydration
    // Use the same pageSize as the client component (24)
    const { products: initialProducts, total: initialTotal } = await getProducts({ 
        category: decodedCategory, 
        limit: 24,
        sort: 'featured' 
    });

    return (
        <CategoryPage 
            initialProducts={initialProducts} 
            initialTotal={initialTotal}
            initialCategory={decodedCategory}
            slug={slug}
        />
    );
}
