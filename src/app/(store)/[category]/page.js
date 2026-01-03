import React from 'react';
import { getProducts } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import getImageUrl from '@/utils/imageUrl';
import { ArrowLeft } from 'lucide-react';

// Since this is a server component in (store), we can fetch data directly
// But for now let's just create a basic placeholder structure that works
// We will need params to get the category slug

export default async function CategoryPage({ params }) {
    // Await params first (Next.js 15+ requirement, good practice generally)
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

    // Fetch products for this category
    const { products } = await getProducts({ category: decodedCategory, limit: 100 });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-4 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 capitalize mb-2">{decodedCategory}</h1>
                    <p className="text-slate-500">Browse our collection of {decodedCategory}</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-xl text-slate-600 font-medium">No products found in this category.</p>
                        <Link href="/" className="mt-4 inline-block text-emerald-600 hover:underline">Browse all products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <Link key={product._id} href={`/product/${product.slug}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                    <Image
                                        src={getImageUrl(product.images?.[0])}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.salePrice && (
                                        <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Sale
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors mb-1">{product.title}</h3>
                                    <div className="flex items-baseline gap-2">
                                        {product.salePrice ? (
                                            <>
                                                <span className="font-bold text-emerald-600">Rs. {product.salePrice.toLocaleString()}</span>
                                                <span className="text-xs text-slate-400 line-through">Rs. {product.price.toLocaleString()}</span>
                                            </>
                                        ) : (
                                            <span className="font-bold text-slate-900">Rs. {product.price.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
