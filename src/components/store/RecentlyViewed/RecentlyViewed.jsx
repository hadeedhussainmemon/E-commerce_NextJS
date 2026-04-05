"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/store/ProductCard/ProductCard';
import config from '@/config';

const RecentlyViewed = () => {
    const [recentProducts, setRecentProducts] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            // Parse history from existing localStorage key
            const history = JSON.parse(localStorage.getItem('coolcache_view_history') || '[]');

            // We only have basic info in history (id, title, category) plus maybe image/price if stored
            // But typically RecommendedProducts stored: { id, title, category, viewedAt }
            // Ideally we need full product data to render the card.
            // Since we don't want to fetch individual products one by one, we can:
            // 1. Check if we have enough data in history. 
            // 2. Or better, fetch details for these IDs.

            // Let's assume for now we might need to fetch them if the history object is thin.
            // However, looking at RecommendedProducts.jsx, it pushes: { id, title, category, viewedAt }
            // This is missing image and price which are critical for the card.

            // STRATEGY: Fetch all products and filter by ID. 
            // This is efficient enough for client-side given < 1000 items usually, 
            // or we can hit an endpoint like /api/products?ids=... if it exists.
            // Given the current API structure, let's fetch 'featured' or just all to match IDs.
            // A cleaner way is to fetch the specific IDs if possible, but let's try to find them in a general fetch
            // or rely on a "get by ids" if we implemented it. 
            // Let's stick to client-side filtering from a general fetch for simplicity if list is small,
            // OR update the `useTrackProductView` in RecommendedProducts to store MORE data so we don't need a fetch.
            // But we can't change existing localStorage data easily.

            // Let's try fetching the products corresponding to the IDs.
            if (history.length > 0) {
                const ids = history.map(h => h.id).slice(0, 8); // Top 8 recent
                if (ids.length === 0) return;

                // Fetch all products to find matches (simplest given current API)
                // Optimization: In a real large app, we'd want an endpoint /api/products/batch?ids=1,2,3
                const API_BASE_URL = (config.api.baseUrl || '').replace(/\/$/, '');
                fetch(`${API_BASE_URL}/api/products?limit=1000`)
                    .then(res => res.json())
                    .then(data => {
                        const all = Array.isArray(data) ? data : data.products || [];
                        // Map history IDs to full product objects preserving order
                        const found = ids.map(id => all.find(p => p.id == id)).filter(Boolean);
                        // Remove duplicates just in case
                        const unique = [];
                        const seen = new Set();
                        found.forEach(p => {
                            if (!seen.has(p.id)) {
                                seen.add(p.id);
                                unique.push(p);
                            }
                        });
                        setRecentProducts(unique);
                    })
                    .catch(err => console.error("Failed to load recent products", err));
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    if (!mounted || recentProducts.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div className="max-w-md">
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Personalized</span>
                    <h2 className="font-fashion-serif text-4xl md:text-5xl italic font-black text-black tracking-tighter leading-tight">
                        Recently Viewed
                    </h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-4">Your fashion discovery history</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
