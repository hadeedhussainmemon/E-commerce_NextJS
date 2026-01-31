"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../ProductCard/ProductCard';
import { fetchProducts as fetchProductsFromCache } from '../../utils/productCache';
import config from '../../config';
import { motion } from 'framer-motion';

const AllRecommendations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = config.api.baseUrl;
  const API_PRODUCTS = config.api.endpoints.products;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        // Get view history from localStorage
        const history = JSON.parse(localStorage.getItem('petal_plus_pupViewHistory') || '[]');

        if (history.length === 0) {
          // If no history, fetch trending products (cached short-term)
          const cacheKey = 'trending_products_v1';
          const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
          if (cached && Date.now() - cached.ts < 1000 * 60 * 5) {
            setProducts(cached.data);
          } else {
            const data = await fetchProductsFromCache({ baseUrl: API_BASE_URL, path: API_PRODUCTS, pageSize: 20, ttl: 1000 * 60 * 5 });
            const list = data.products || data || [];
            setProducts(list);
            try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: list })); } catch (e) { }
          }
        } else {
          // Extract unique categories from history and fetch in parallel (flatten arrays)
          const categories = [...new Set(history.flatMap(item => (Array.isArray(item.category) ? item.category : [item.category])).filter(Boolean))];
          const fetches = categories.map(cat => fetchProductsFromCache({ baseUrl: API_BASE_URL, path: API_PRODUCTS, category: cat, pageSize: 50 }).catch(() => ({ products: [] })));
          const results = await Promise.all(fetches);
          // Each result may be an object with a `products` array — extract them and flatten.
          const allProducts = results.flatMap(r => (Array.isArray(r) ? r : (r.products || []))).filter(Boolean);

          // Filter out already viewed products
          const viewedIds = new Set(history.map(item => item.id));
          const filtered = allProducts.filter(p => !viewedIds.has(p.id));

          // Shuffle and limit
          const shuffled = filtered.sort(() => Math.random() - 0.5);
          setProducts(shuffled.slice(0, 20));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 relative overflow-hidden">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Neural Discovery Engine
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter">
            Curated for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">You</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed border-l-2 border-emerald-500/30 pl-6 ml-auto mr-auto inline-block text-left">
            Our intelligent recommendation system analyzes your browsing patterns to surface products that align with your unique taste profile.
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-xl p-4 animate-pulse"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-800/50" />
                <div className="h-4 bg-slate-800/50 rounded mt-4 w-3/4" />
                <div className="h-3 bg-slate-800/50 rounded mt-3 w-1/2" />
                <div className="h-10 bg-slate-800/50 rounded-xl mt-4 w-full" />
              </motion.div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-slate-900/40 backdrop-blur-sm border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
              <svg className="w-16 h-16 text-slate-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>

            <h3 className="text-3xl font-display font-black text-white mb-4 tracking-tight">
              Discovery Matrix Initializing
            </h3>
            <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
              Begin exploring our catalog to activate the neural recommendation engine and unlock personalized product curation.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(16,185,129,0.4)] transform hover:scale-105 active:scale-95 uppercase text-xs tracking-[0.2em]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Initiate Exploration
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    description={product.description}
                    image={product.image}
                    material={product.material}
                    category={product.category}
                    stock={product.stock}
                    isCustomizable={product.isCustomizable}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-16"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900/40 backdrop-blur-sm border border-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-800/60 hover:text-white hover:border-emerald-500/30 transition-all duration-300 shadow-xl group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Marketplace
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllRecommendations;
