"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import config from '../../config';

// Dedicated Related Products Component
const RelatedProducts = ({ currentId, category }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use config API base
    const API_BASE_URL = config.api.baseUrl;

    useEffect(() => {
        async function fetchRelated() {
            try {
                setLoading(true);
                // Use first category if it's an array
                const rawCategory = Array.isArray(category) ? category[0] : category;
                if (!rawCategory) return;

                // Convert to slug: basic version matching backend expectation usually
                const slug = rawCategory.toLowerCase().replace(/\s+/g, '-');

                // Use the main products endpoint with category filter
                const base = (API_BASE_URL || '').replace(/\/$/, '');
                const res = await fetch(`${base}/api/products?category=${encodeURIComponent(slug)}&pageSize=8`);
                if (!res.ok) throw new Error('Fetch failed');

                const data = await res.json();
                const list = data.products || (Array.isArray(data) ? data : []);

                setItems(list.filter(p => p.id !== Number(currentId)).slice(0, 4));
            } catch (e) {
                console.error('RelatedProducts: fetch error', e);
                setItems([]);
            } finally {
                setLoading(false);
            }
        }
        fetchRelated();
    }, [API_BASE_URL, category, currentId]);

    if (loading || !items.length) return null;

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-6 font-playfair">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {items.map(p => (
                    <div key={p.id} className="h-full">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
