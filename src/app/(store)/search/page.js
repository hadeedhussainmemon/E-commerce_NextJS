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
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                    <h1 className="font-fashion-serif text-5xl md:text-6xl italic font-black text-black tracking-tighter">
                        Discover
                    </h1>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400">
                        {loading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'Result' : 'Results'}`}
                    </span>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-24 max-w-2xl">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for essentials, dresses, and more..."
                        className="w-full pl-0 pr-12 py-6 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none font-fashion-serif text-2xl italic tracking-tight transition-all placeholder:text-gray-200"
                        autoFocus
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" size={24} strokeWidth={1.5} />
                </form>

                {/* Results */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-black" size={32} strokeWidth={1} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Loading Pieces</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {results.map(product => (
                            <div key={product._id} className="group flex flex-col">
                                <Link href={`/product/${product.slug}`} className="block">
                                    <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden mb-6">
                                        <Image
                                            src={getImageUrl(product.images?.[0])}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                {product.category}
                                            </span>
                                            <h3 className="font-fashion-serif text-lg italic font-black text-black tracking-tight group-hover:opacity-70 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">
                                                {product.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm font-bold text-black font-fashion-sans">
                                            Rs. {product.price?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center py-32 border-t border-gray-100">
                        <h2 className="font-fashion-serif text-3xl italic font-black text-black mb-4">No Pieces Found</h2>
                        <p className="text-gray-500 text-sm font-medium mb-12">Try refining your search or checking your spelling.</p>
                        <button
                            onClick={() => setQuery('')}
                            className="px-12 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-32 border-t border-gray-100">
                        <div className="w-16 h-16 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search size={24} strokeWidth={1} className="text-gray-300" />
                        </div>
                        <h2 className="font-fashion-serif text-2xl italic font-black text-gray-300">Searching for something special?</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
