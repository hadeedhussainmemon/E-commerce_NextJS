"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../ProductCard/ProductCard';
import config from '../../config';

const RecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get browsing history from localStorage
    const viewedProducts = JSON.parse(localStorage.getItem('coolcache_view_history') || '[]');
    const API_BASE_URL = config.api.baseUrl;

    // Fetch recommendations based on viewed categories
    async function fetchRecommendations() {
      try {
        setLoading(true);

        // Get unique categories from viewed products (flatten arrays)
        const viewedCategories = [...new Set(viewedProducts.flatMap(p => (Array.isArray(p.category) ? p.category : [p.category])).filter(Boolean))];

        if (viewedCategories.length === 0) {
          // No history, show trending products
          const res = await fetch(`${API_BASE_URL}/api/products?sort=featured&pageSize=8`);
          const data = await res.json();
          const products = Array.isArray(data) ? data : data.products || [];
          setRecommendations(products);
        } else {
          // Fetch products from viewed categories
          const categoryPromises = viewedCategories.slice(0, 3).map(cat =>
            fetch(`${API_BASE_URL}/api/products/category/${encodeURIComponent(cat)}?limit=3`)
              .then(res => res.json())
          );

          const categoryResults = await Promise.all(categoryPromises);
          // Each result may be an array or {products: []} object — extract product arrays
          const allProducts = categoryResults.flatMap(r => Array.isArray(r) ? r : (r.products || []));

          // Deduplicate products based on ID (fixing the issue where same product in multiple categories repeats)
          const uniqueProductsMap = new Map();
          allProducts.forEach(p => {
            if (p && p.id && !uniqueProductsMap.has(p.id)) {
              uniqueProductsMap.set(p.id, p);
            }
          });
          const uniqueProducts = Array.from(uniqueProductsMap.values());

          // Filter out already viewed products
          const viewedIds = new Set(viewedProducts.map(p => p.id));
          const filtered = uniqueProducts.filter(p => !viewedIds.has(p.id));

          // Randomize and limit
          const shuffled = filtered.sort(() => Math.random() - 0.5);
          setRecommendations(shuffled.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-3 animate-pulse">
              <div className="w-full aspect-square rounded-lg bg-gray-100" />
              <div className="h-4 bg-gray-100 rounded mt-3 w-3/4" />
              <div className="h-3 bg-gray-100 rounded mt-2 w-1/2" />
              <div className="h-9 bg-gray-100 rounded mt-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 md:mb-0">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="max-w-md">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Personalized</span>
          <h2 className="font-fashion-serif text-4xl md:text-5xl italic font-black text-black tracking-tighter leading-tight">
            Curated For You
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-4">Based on your browsing history</p>
        </div>
        <Link
          href="/recommendations"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:opacity-50 transition-opacity flex items-center gap-2"
        >
          View All <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};



export default RecommendedProducts;
