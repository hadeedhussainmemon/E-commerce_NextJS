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

// Constants
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Check, Clock, Star, Zap } from 'lucide-react';

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
    const [activePromo, setActivePromo] = useState(0);

    // Fetch Categories (SSR + Client)
    const { data: categoryData } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategoriesQuery,
        initialData: initialCategories || undefined, // Use SSR data
        staleTime: 1000 * 60 * 60,
    });

    const categories = ['All', ...(categoryData?.categories?.map(c => typeof c === 'string' ? c : c.name) || [])];

    // Promo rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setActivePromo((prev) => (prev + 1) % PROMOS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

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

    // Use initialData mostly for the *first* render (default params)
    const isDefaultParams = selectedCategory === 'All' && sortOption === 'featured' && !debouncedQuery && currentPage === 1;

    // React Query
    const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
        queryKey: ['products', {
            category: selectedCategory === 'All' ? '' : selectedCategory,
            sort: sortOption,
            q: debouncedQuery,
            page: currentPage,
            pageSize
        }],
        queryFn: fetchProductsQuery,
        // Only use valid initialData if checking default params, otherwise fetch fresh
        initialData: isDefaultParams ? initialProducts : undefined,
        placeholderData: keepPreviousData,
    });

    const products = data?.products || [];
    const totalProducts = data?.total || 0;
    const totalPages = Math.ceil(totalProducts / pageSize);
    const soldOutCount = products.filter(p => p?.stock === 0).length;

    const handlePageChange = (p) => {
        if (p >= 1 && p <= totalPages) {
            setCurrentPage(p);
            // Scroll to top of products section
            const el = document.getElementById('products');
            if (el) {
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    };

    // SEO Canonical
    const seoCanonical = `${config.api.baseUrl}/${currentPage > 1 ? `?page=${currentPage}` : ''}`;

    return (
        <>
            <SEO canonical={seoCanonical} />
            <Hero />

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                id="main-content"
                className="relative overflow-hidden"
            >
                {/* Floating Micro-assets for Depth */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            y: [0, -40, 0],
                            x: [0, 20, 0],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[10%] left-[5%] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 60, 0],
                            x: [0, -30, 0],
                            rotate: [0, -120, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[40%] right-[2%] w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.03, 0.08, 0.03],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-teal-500/5 rounded-full blur-[80px]"
                    />
                </div>

                {/* Premium Benefits Section */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Truck className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-900">Fast Delivery</h3>
                                    <p className="text-sm text-slate-500 group-hover:text-emerald-700">Orders delivered within 3-5 days</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-900">Quality Assured</h3>
                                    <p className="text-sm text-slate-500 group-hover:text-emerald-700">100% authentic premium gear</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Star className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-900">Premium Support</h3>
                                    <p className="text-sm text-slate-500 group-hover:text-emerald-700">Dedicated assistance for you</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <BrandStories />

                <CategoryGrid categoriesFromSSR={categoryData} />


                <section id="products" className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
                    {/* Promo Banner */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 overflow-hidden mb-8">
                        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 animate-fade-in-up">
                                <span className="text-xl">✨</span>
                                <p className="font-medium text-sm md:text-base tracking-wide">{PROMOS[activePromo]}</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header & Filters */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent mb-3 animate-gradient">
                                All Products
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 mx-auto rounded-full mb-4"></div>
                        </div>

                        <div className="flex flex-col gap-8 mb-12 px-6 py-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-emerald-900/5">
                            {/* Interactive Category Pills */}
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={16} className="text-emerald-500" />
                                        Explore Collections
                                    </h3>
                                    <Link href="/categories" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        View All
                                    </Link>
                                </div>
                                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedCategory(c)}
                                            className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${selectedCategory === c
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 scale-105'
                                                : 'bg-white text-slate-600 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {/* Sort Filter */}
                                <div className="w-full">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-2">Sort by Preference</label>
                                    <div className="relative group">
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="block w-full pl-5 pr-10 py-4 rounded-2xl bg-white/80 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 appearance-none shadow-sm transition-all group-hover:border-emerald-200"
                                        >
                                            <option value="featured">Featured Trends</option>
                                            <option value="priceAsc">Price: Minimalist to Luxury</option>
                                            <option value="priceDesc">Price: Luxury to Minimalist</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Search */}
                                <div className="w-full relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-2">Search Products</label>
                                    <div className="relative group">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Find something special..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 shadow-sm transition-all group-hover:border-emerald-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        {isError ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error?.message || "Error loading products"}</p>
                                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">Try Again</button>
                            </div>
                        ) : isLoading ? (
                            <div className="text-center py-12">Loading products...</div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                No products found.
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4 px-2 text-sm text-gray-600">
                                    <span>Showing {totalProducts} products</span>
                                    {soldOutCount > 0 && <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">Sold out: {soldOutCount}</span>}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {products.map((p, i) => (
                                        <div key={`${p.id}-${i}`} className="animate-stagger-item h-full">
                                            <ProductCard product={p} priority={i < 4} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8 gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1 || isPlaceholderData}
                                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <span className="flex items-center px-4 font-medium">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || isPlaceholderData}
                                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </motion.div>
        </>
    );
}
