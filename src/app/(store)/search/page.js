"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import getImageUrl from '@/utils/imageUrl';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.products || []);
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.replace(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Search Results</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-12 max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg transition-all"
                        autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                </form>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-600" size={48} />
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.map(product => (
                            <Link key={product._id} href={`/product/${product.slug}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                    <Image
                                        src={getImageUrl(product.images?.[0])}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors mb-1">{product.title}</h3>
                                    <p className="font-bold text-slate-900">Rs. {product.price?.toLocaleString() || 0}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">No results found for "{query}"</p>
                        <p className="mt-2">Try checking your spelling or using different keywords.</p>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Start typing to search for products</p>
                    </div>
                )}
            </div>
        </div>
    );
}
