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
        <div className="mt-16 border-t border-slate-100 pt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-1 w-8 bg-emerald-500 rounded-full"></span>
                        <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.2em]">Curated for you</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Similar Products</h2>
                </div>
                {category && (
                    <Link
                        href={`/category/${encodeURIComponent(String(Array.isArray(category) ? category[0] : category).toLowerCase().replace(/\s+/g, '-'))}`}
                        className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                    >
                        View Collection
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
                {items.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full"
                    >
                        <ProductCard product={p} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default RelatedProducts;
