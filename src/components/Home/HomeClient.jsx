"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Hero from '../Hero/Hero';
import ProductCard from '../ProductCard/ProductCard';
import CategoryGrid from '../Category/CategoryGrid';
import SEO from '../SEO/SEO';
import config from '../../config';
import Link from 'next/link';
import BrandStories from './BrandStories';
import Lookbook from './Lookbook';

// Constants
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Check, Clock, Star, Zap, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = config.api.baseUrl;
const API_PRODUCTS_ENDPOINT = config.api.endpoints.products || '/api/products';

// Promo rotation messages
const PROMOS = [
    "🚚 Free Shipping on Orders Over Rs. 4999",
    "✨ New Arrivals: Check out our latest collection!",
    "🎁 Buy 2 Get 5% Off - Limited Time Offer!"
];

const fetchProductsQuery = async ({ queryKey }) => {
    const [_, { category, sort, q, page, pageSize }] = queryKey;
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (q) params.append('q', q);
    if (sort) params.append('sort', sort);
    params.append('page', page);
    params.append('pageSize', pageSize);

    const base = (API_BASE_URL || '').replace(/\/$/, '');
    const response = await fetch(`${base}${API_PRODUCTS_ENDPOINT}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

const fetchCategoriesQuery = async () => {
    const base = (API_BASE_URL || '').replace(/\/$/, '');
    const res = await fetch(`${base}${API_PRODUCTS_ENDPOINT}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
};

export default function HomeClient({ initialProducts = null, initialCategories = null }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const pageSize = 24;

    // Fetch Categories
    const { data: categoryData } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategoriesQuery,
        initialData: initialCategories || undefined,
        staleTime: 1000 * 60 * 60,
    });

    const categories = ['All', ...(categoryData?.categories?.map(c => typeof c === 'string' ? c : c.name) || [])];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, sortOption]);

    const isDefaultParams = selectedCategory === 'All' && sortOption === 'featured' && !debouncedQuery && currentPage === 1;

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
        queryKey: ['products', {
            category: selectedCategory === 'All' ? '' : selectedCategory,
            sort: sortOption,
            q: debouncedQuery,
            page: currentPage,
            pageSize
        }],
        queryFn: fetchProductsQuery,
        initialData: isDefaultParams ? initialProducts : undefined,
        placeholderData: keepPreviousData,
    });

    const products = data?.products || [];
    const totalProducts = data?.total || 0;
    const totalPages = Math.ceil(totalProducts / pageSize);

    const handlePageChange = (p) => {
        if (p >= 1 && p <= totalPages) {
            setCurrentPage(p);
            const el = document.getElementById('products');
            if (el) {
                const offset = 120;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    };

    const seoCanonical = `${config.api.baseUrl}/${currentPage > 1 ? `?page=${currentPage}` : ''}`;

    return (
        <div className="bg-white">
            <SEO canonical={seoCanonical} />
            <Hero />

            <main id="main-content" className="relative">
                {/* Minimalist Benefits Section */}
                <section className="py-32 border-b border-gray-100 bg-gray-50/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                            <div className="space-y-6">
                                <div className="text-black inline-block pb-4 border-b border-black/10">
                                    <Truck size={24} strokeWidth={1} />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black italic font-fashion-serif">Express Shipping</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Complimentary delivery on orders above Rs. 4999.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="text-black inline-block pb-4 border-b border-black/10">
                                    <Star size={24} strokeWidth={1} />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black italic font-fashion-serif">Curated Quality</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Hand-selected pieces for the discerning lifestyle.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="text-black inline-block pb-4 border-b border-black/10">
                                    <ShieldCheck size={24} strokeWidth={1} />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black italic font-fashion-serif">Secure Checkout</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Integrated protected payment gateways.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-24">
                    <BrandStories products={products} />
                </div>

                <div className="border-t border-gray-100">
                    <CategoryGrid categoriesFromSSR={categoryData} />
                </div>

                <div className="border-t border-gray-100">
                    <Lookbook />
                </div>

                {/* Products Section */}
                <section id="products" className="py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                            <div className="max-w-xl">
                                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-6 block">Our Collection</span>
                                <h2 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black tracking-tighter leading-none">
                                    Shop New Pieces
                                </h2>
                            </div>

                            {/* Search & Sort */}
                            <div className="flex flex-col sm:flex-row gap-6 flex-grow max-w-2xl md:justify-end">
                                <div className="relative group flex-grow max-w-xs">
                                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH PIECES"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full pl-8 pr-4 py-4 bg-transparent border-b-2 border-gray-100 outline-none text-[11px] font-bold uppercase tracking-[0.2em] transition-all focus:border-black placeholder:text-gray-200"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="px-8 py-4 bg-black text-white outline-none text-[10px] font-bold uppercase tracking-[0.2em] appearance-none cursor-pointer hover:bg-gray-900 transition-colors pr-12"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="priceAsc">Price: Low to High</option>
                                        <option value="priceDesc">Price: High to Low</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-10 overflow-x-auto pb-8 mb-16 border-b border-gray-100 scrollbar-hide">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedCategory(c)}
                                    className={`text-[11px] font-bold uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-300 relative pb-4 ${selectedCategory === c ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                                        }`}
                                >
                                    {c}
                                    {selectedCategory === c && (
                                        <motion.div layoutId="underline_home" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Grid */}
                        {isError ? (
                            <div className="text-center py-32">
                                <p className="text-black font-fashion-serif text-2xl italic font-black mb-10">{error?.message || "Something went wrong."}</p>
                                <button onClick={() => window.location.reload()} className="px-12 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors">Try Again</button>
                            </div>
                        ) : isLoading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 animate-pulse">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="space-y-6">
                                        <div className="aspect-[3/4] bg-gray-50 rounded-sm" />
                                        <div className="h-4 bg-gray-50 w-2/3" />
                                        <div className="h-4 bg-gray-50 w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                                    {products.map((p, i) => (
                                        <ProductCard key={`${p.id}-${i}`} product={p} />
                                    ))}
                                </div>

                                {products.length === 0 && (
                                    <div className="text-center py-40 border-t border-gray-50 mt-16">
                                        <p className="font-fashion-serif text-4xl italic text-gray-200">No pieces found.</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-32 gap-6 items-center">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-14 h-14 flex items-center justify-center border border-gray-100 disabled:opacity-20 hover:border-black transition-all group"
                                        >
                                            <ChevronLeft size={20} className="text-gray-400 group-hover:text-black" />
                                        </button>
                                        <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-300">
                                            <span className="text-black">{currentPage}</span> / {totalPages}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-14 h-14 flex items-center justify-center border border-gray-100 disabled:opacity-20 hover:border-black transition-all group"
                                        >
                                            <ChevronRight size={20} className="text-gray-400 group-hover:text-black" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
