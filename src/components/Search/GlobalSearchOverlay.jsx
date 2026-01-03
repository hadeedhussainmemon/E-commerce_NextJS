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
                    className="fixed inset-0 z-[200] bg-[#020617]/95 backdrop-blur-[80px]"
                >
                    <div className="max-w-5xl mx-auto h-full flex flex-col px-6 relative">
                        {/* Background Glows */}
                        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

                        {/* Search Input Area */}
                        <div className="pt-12 md:pt-32 pb-12 relative z-10">
                            <form onSubmit={handleSearch} className="relative group">
                                <div className="absolute inset-0 bg-emerald-500/5 rounded-[2.5rem] blur-xl group-focus-within:bg-emerald-500/10 transition-all duration-700" />
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors w-10 h-10" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search for perfection..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] py-12 pl-24 pr-20 text-3xl md:text-6xl font-playfair font-black text-white focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-700 transition-all outline-none tracking-tight italic"
                                />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-all p-3 hover:rotate-90"
                                >
                                    <X size={40} />
                                </button>
                            </form>
                            <div className="mt-8 flex items-center justify-between text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] px-8">
                                <span className="flex items-center gap-2">
                                    <kbd className="font-sans bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-white">ESC</kbd>
                                    to terminate
                                </span>
                                <span className="flex items-center gap-2">
                                    <Zap size={12} className="text-emerald-500" />
                                    Query intensity: {query.length} / 2 min
                                </span>
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
                                                        className="block w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 font-bold transition-colors truncate border border-transparent hover:border-white/10"
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
                                                    className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold text-sm hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400 transition-all active:scale-95"
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
                                                    <div className="relative aspect-[4/5] rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden mb-4 group-hover:border-emerald-500/30 transition-all shadow-2xl">
                                                        <Image
                                                            src={getImageUrl(p.image)}
                                                            alt={p.title}
                                                            fill
                                                            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-white truncate px-2">{p.title}</h4>
                                                    <p className="text-xs text-emerald-500 font-black px-2 mt-1 uppercase tracking-tight">{p.price} PKR</p>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center bg-white/[0.02] rounded-[2.5rem] border-2 border-dashed border-white/5">
                                            <p className="text-slate-600 font-black uppercase tracking-widest text-xs">
                                                {query.length > 0 ? "Zero matches in current sector" : "Awaiting search query..."}
                                            </p>
                                        </div>
                                    )}

                                    {results.length > 0 && (
                                        <button
                                            onClick={handleSearch}
                                            className="w-full mt-8 py-5 border border-white/10 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs hover:border-emerald-500/30 hover:text-emerald-400 transition-all flex items-center justify-center gap-3 bg-white/[0.02] active:scale-95"
                                        >
                                            Access Full Result Matrix
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
