"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { triggerPremiumFeedback } from '../../utils/feedback';
import getImageUrl from '../../utils/imageUrl';

// Fallback stories if no products are provided
const FALLBACK_STORIES = [
    {
        id: 'new-arrivals',
        title: 'New Arrivals',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?auto=format&fit=crop&q=80&w=800',
        content: 'Discover the latest additions to our premium collection.',
    },
    {
        id: 'best-sellers',
        title: 'Best Sellers',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
        content: 'Explore the pieces everyone is talking about.',
    }
];

export default function BrandStories({ products = [] }) {
    const [activeStory, setActiveStory] = useState(null);
    const [progress, setProgress] = useState(0);

    // Generate random stories from products
    const stories = useMemo(() => {
        if (!products || products.length === 0) return FALLBACK_STORIES;

        // Shuffle and pick 15
        const shuffled = [...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, 15);

        return shuffled.map(p => ({
            id: p.id || p._id,
            title: p.title,
            image: getImageUrl(p.image),
            content: p.description?.slice(0, 100) + (p.description?.length > 100 ? '...' : '') || 'Discover this masterpiece from our collection.',
            price: p.price,
            category: p.category
        }));
    }, [products]);

    const openStory = (story) => {
        setActiveStory(story);
        setProgress(0);
        triggerPremiumFeedback('pop', 'light');
    };

    const closeStory = () => {
        setActiveStory(null);
        setProgress(0);
    };

    useEffect(() => {
        let interval;
        if (activeStory) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        // Navigate to next or close
                        const currentIndex = stories.findIndex(s => s.id === activeStory.id);
                        if (currentIndex < stories.length - 1) {
                            setActiveStory(stories[currentIndex + 1]);
                            return 0;
                        } else {
                            closeStory();
                            return 100;
                        }
                    }
                    return prev + 1;
                });
            }, 50); // 5 seconds per story
        }
        return () => clearInterval(interval);
    }, [activeStory, stories]);

    return (
        <section className="w-full mb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </motion.div>
                        Live Highlights
                    </h3>
                </div>

                {/* Story Circles */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-2">
                    {stories.map((story) => (
                        <button
                            key={story.id}
                            onClick={() => openStory(story)}
                            className="flex flex-col items-center gap-3 group shrink-0"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 active:scale-95 transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:-translate-y-1">
                                <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-slate-50 relative flex items-center justify-center">
                                    {story.image && !story.image.includes('placeholder') ? (
                                        <Image
                                            src={story.image}
                                            alt={story.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            unoptimized={true}
                                        />
                                    ) : (
                                        <div className="text-center p-2">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter leading-none block">
                                                {story.title.split(' ').slice(0, 2).join('\n')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-500 transition-colors w-20 sm:w-24 truncate text-center">
                                {story.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Viewer Overlay */}
            <AnimatePresence>
                {activeStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-0 sm:p-4"
                    >
                        <div className="relative w-full max-w-sm aspect-[9/16] bg-slate-900 overflow-hidden shadow-2xl sm:rounded-3xl">
                            {/* Progress Bars */}
                            <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
                                {stories.map((story, idx) => {
                                    const activeIdx = stories.findIndex(s => s.id === activeStory.id);
                                    let w = "0%";
                                    if (idx < activeIdx) w = "100%";
                                    if (idx === activeIdx) w = `${progress}%`;

                                    return (
                                        <div key={story.id} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: w }} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Header */}
                            <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
                                        <Image src={activeStory.image} alt="Logo" fill className="object-cover" />
                                    </div>
                                    <span className="text-white font-bold text-sm tracking-wide">{activeStory.title}</span>
                                </div>
                                <button onClick={closeStory} className="text-white/80 hover:text-white p-2">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Main Content */}
                            <motion.div
                                key={activeStory.id}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={activeStory.image}
                                    alt={activeStory.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                                <div className="absolute bottom-12 left-6 right-6 text-white space-y-4">
                                    <h2 className="text-3xl font-playfair font-black leading-tight italic">{activeStory.title}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">{activeStory.category}</span>
                                        <span className="text-emerald-400 font-black tracking-tight">Rs. {activeStory.price}</span>
                                        <span className="text-[9px] text-white/30 font-mono font-bold uppercase tracking-tighter ml-auto">Node: {activeStory.id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <p className="text-white/80 font-medium text-sm leading-relaxed">{activeStory.content}</p>
                                    <Link
                                        href={`/product/${activeStory.id}`}
                                        onClick={() => {
                                            triggerPremiumFeedback('success', 'medium');
                                            closeStory();
                                        }}
                                        className="w-full py-4 bg-white text-black text-center rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform inline-block group"
                                    >
                                        Extract Masterpiece
                                        <ChevronRight size={16} className="inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Navigation Taps */}
                            <div className="absolute inset-0 z-10 flex">
                                <div
                                    className="w-1/3 h-full cursor-west-resize"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const idx = stories.findIndex(s => s.id === activeStory.id);
                                        if (idx > 0) {
                                            setActiveStory(stories[idx - 1]);
                                            setProgress(0);
                                        }
                                    }}
                                />
                                <div
                                    className="w-2/3 h-full cursor-east-resize"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const idx = stories.findIndex(s => s.id === activeStory.id);
                                        if (idx < stories.length - 1) {
                                            setActiveStory(stories[idx + 1]);
                                            setProgress(0);
                                        } else {
                                            closeStory();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
