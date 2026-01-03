"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ProductCard from '../ProductCard/ProductCard';
import ProductCardSkeleton from '../Skeletons/ProductCardSkeleton';
import SEO from '../SEO/SEO';
import config from '../../config';

const fetchProductsQuery = async ({ queryKey }) => {
    const [_, { sort, page, pageSize }] = queryKey;

    const params = new URLSearchParams();
    params.append('sort', sort);
    params.append('page', page);
    params.append('limit', pageSize || 20);

    const API_BASE_URL = config.api.baseUrl;
    const baseUrl = config.api.endpoints.products;

    const response = await fetch(`${API_BASE_URL}${baseUrl}?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return response.json();
};

export default function NewArrivals() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const [currentPage, setCurrentPage] = useState(pageParam);

    const {
        data,
        isLoading,
        isError,
        error,
        isPlaceholderData
    } = useQuery({
        queryKey: ['products', {
            sort: 'newest',
            page: currentPage,
            pageSize: 20
        }],
        queryFn: fetchProductsQuery,
        placeholderData: keepPreviousData,
    });

    const products = data?.products || [];
    const totalProducts = data?.total || 0;
    const totalPages = Math.ceil(totalProducts / 20);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="New Arrivals | Premium Collection"
                description="Explore our latest additions. Fresh styles, premium quality, newly arrived for you."
            />

            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse"></div>
                    <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[60px] animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400 uppercase tracking-widest mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Just Landed
                    </div>
                    <h1 className="text-4xl md:text-7xl font-display font-black text-white mb-6 uppercase tracking-tight">
                        New <span className="text-emerald-500 underline decoration-slate-700">Arrivals</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        The latest drops from our premium collection. Be the first to own our newest curated pieces.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 font-bold mb-4">{error.message}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-xl">Retry</button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No new products found yet. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || isPlaceholderData}
                                    className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors font-bold text-sm"
                                >
                                    Previous
                                </button>
                                <span className="text-slate-900 font-black text-sm uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || isPlaceholderData}
                                    className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors font-bold text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
