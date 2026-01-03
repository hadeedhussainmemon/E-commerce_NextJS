"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, History, ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import getImageUrl from '../../utils/imageUrl';
import config from '../../config';
import { triggerPremiumFeedback } from '../../utils/feedback';

const TRENDING = [
    "Silver Collection",
    "Gold Necklaces",
    "Emerald Rings",
    "Luxury Sets"
];

export default function GlobalSearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const router = useRouter();

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Load recent searches
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    const searchProducts = useCallback(async (q) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        try {
            const API_BASE_URL = config.api.baseUrl || '';
            const res = await fetch(`${API_BASE_URL}/api/products?q=${encodeURIComponent(q)}&pageSize=6`);
            if (res.ok) {
                const data = await res.json();
                setResults(data.products || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, searchProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Save recent
        const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));

        triggerPremiumFeedback('success', 'light');
        router.push(`/?q=${encodeURIComponent(query)}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[150] bg-white/95 backdrop-blur-3xl"
                >
                    <div className="max-w-5xl mx-auto h-full flex flex-col px-6">
                        {/* Search Input Area */}
                        <div className="pt-12 md:pt-24 pb-12">
                            <form onSubmit={handleSearch} className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-8 h-8" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search for perfection..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-3xl py-10 pl-20 pr-16 text-2xl md:text-5xl font-playfair font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-300 transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-2"
                                >
                                    <X size={32} />
                                </button>
                            </form>
                            <div className="mt-4 flex items-center justify-between text-slate-400 text-sm px-4">
                                <span>Press <kbd className="font-sans font-bold bg-slate-100 px-1.5 py-0.5 rounded">ESC</kbd> to close</span>
                                <span>Type at least 2 characters</span>
                            </div>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto pb-12 scrollbar-hide">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left Column: Trends & History */}
                                <div className="lg:col-span-4 space-y-12">
                                    {recentSearches.length > 0 && (
                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <History size={14} />
                                                Recent History
                                            </h3>
                                            <div className="space-y-3">
                                                {recentSearches.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => { setQuery(s); triggerPremiumFeedback('pop', 'light'); }}
                                                        className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold transition-colors truncate"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <TrendingUp size={14} />
                                            Trending Now
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {TRENDING.map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => { setQuery(t); triggerPremiumFeedback('pop', 'light'); }}
                                                    className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600 font-bold text-sm hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all active:scale-95"
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Results */}
                                <div className="lg:col-span-8">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Zap size={14} />
                                        {query.length > 0 ? `Results for "${query}"` : 'Top Collections'}
                                    </h3>

                                    {isLoading ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="aspect-[4/5] bg-slate-100 rounded-3xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                            {results.map((p) => (
                                                <Link
                                                    key={p.id}
                                                    href={`/product/${p.slug || p.id}`}
                                                    onClick={onClose}
                                                    className="group"
                                                >
                                                    <div className="relative aspect-[4/5] rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden mb-3">
                                                        <Image
                                                            src={getImageUrl(p.image)}
                                                            alt={p.title}
                                                            fill
                                                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900 truncate">{p.title}</h4>
                                                    <p className="text-xs text-emerald-600 font-black">{p.price} PKR</p>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                            <p className="text-slate-400 font-medium">
                                                {query.length > 0 ? "No matches found. Try something else?" : "Start typing to search..."}
                                            </p>
                                        </div>
                                    )}

                                    {results.length > 0 && (
                                        <button
                                            onClick={handleSearch}
                                            className="w-full mt-8 py-4 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            See All Results
                                            <ArrowRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
