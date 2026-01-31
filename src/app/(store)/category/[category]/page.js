import React from 'react';
import { getProducts } from '@/lib/data';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard/ProductCard';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

// Server-side fetch for metadata
export async function generateMetadata({ params }) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

    return {
        title: `${decodedCategory.toUpperCase()} | Petal + Pup`,
        description: `Shop our latest collection of ${decodedCategory}. Curated for style and elegance.`,
        openGraph: {
            title: `${decodedCategory} - Petal + Pup Collection`,
            description: `Browse the finest ${decodedCategory} at Petal + Pup.`,
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params }) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

    // Fetch products for this category
    const { products } = await getProducts({ category: decodedCategory, limit: 100 });

    const breadcrumbItems = [
        { name: 'Home', to: '/' },
        { name: decodedCategory, to: null }
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-24">
                <header className="mb-20">
                    <div className="mb-12">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-md">
                        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Collection</span>
                        <h1 className="font-fashion-serif text-5xl md:text-6xl italic font-black text-black tracking-tighter leading-tight mb-6 capitalize">
                            {decodedCategory}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Discover our curated selection of {decodedCategory}, designed for the modern lifestyle with an emphasis on quality and timeless elegance.
                        </p>
                    </div>
                </header>

                {products.length === 0 ? (
                    <div className="text-center py-32 border-t border-gray-100">
                        <p className="font-fashion-serif text-2xl italic text-gray-400 mb-8">No pieces found in this collection.</p>
                        <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:opacity-50 transition-all">
                            Back To Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {products.map(product => (
                            <ProductCard key={product.id || product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
