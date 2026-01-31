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

    const stories = useMemo(() => {
        if (!products || products.length === 0) return FALLBACK_STORIES;
        const shuffled = [...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, 15);

        return shuffled.map(p => ({
            id: p.id || p._id,
            title: p.title,
            image: getImageUrl(p.image),
            content: p.description?.slice(0, 100) + (p.description?.length > 100 ? '...' : '') || 'Discover this masterpiece from our collection.',
            price: p.price,
            category: p.category,
            slug: p.slug
        }));
    }, [products]);

    const openStory = (story) => {
        setActiveStory(story);
        setProgress(0);
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
            }, 50);
        }
        return () => clearInterval(interval);
    }, [activeStory, stories]);

    return (
        <section className="w-full mb-24 px-6 sm:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.4em]">
                        Latest Stories
                    </h3>
                </div>

                {/* Story Cards */}
                <div className="relative">
                    <button
                        onClick={() => {
                            const container = document.getElementById('stories-scroll');
                            if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                        }}
                        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm hover:border-black transition-all"
                    >
                        <ChevronLeft size={20} className="text-black" />
                    </button>

                    <button
                        onClick={() => {
                            const container = document.getElementById('stories-scroll');
                            if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                        }}
                        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm hover:border-black transition-all"
                    >
                        <ChevronRight size={20} className="text-black" />
                    </button>

                    <div id="stories-scroll" className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth">
                        {stories.map((story) => (
                            <button
                                key={story.id}
                                onClick={() => openStory(story)}
                                className="relative shrink-0 w-40 h-72 rounded-sm overflow-hidden group active:scale-[0.98] transition-all"
                            >
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                <div className="absolute inset-0 border border-black/5 group-hover:border-black/20 transition-all" />

                                <div className="absolute top-4 left-4 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg ring-2 ring-black/5">
                                    <Image src={story.image} alt="" fill className="object-cover" />
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 text-left">
                                    <p className="text-white font-fashion-sans font-bold text-[10px] leading-tight uppercase tracking-wider line-clamp-2">
                                        {story.title}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Story Viewer Overlay */}
            <AnimatePresence>
                {activeStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-sm aspect-[9/16] bg-black overflow-hidden shadow-2xl">
                            {/* Progress Bars */}
                            <div className="absolute top-6 left-6 right-6 z-50 flex gap-1.5">
                                {stories.map((story, idx) => {
                                    const activeIdx = stories.findIndex(s => s.id === activeStory.id);
                                    let w = "0%";
                                    if (idx < activeIdx) w = "100%";
                                    if (idx === activeIdx) w = `${progress}%`;

                                    return (
                                        <div key={story.id} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: w }} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Header */}
                            <div className="absolute top-10 left-6 right-6 z-20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden relative">
                                        <Image src={activeStory.image} alt="" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-[11px] uppercase tracking-widest">{activeStory.title}</span>
                                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{activeStory.category}</span>
                                    </div>
                                </div>
                                <button onClick={closeStory} className="text-white/60 hover:text-white transition-colors">
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Main Content */}
                            <motion.div
                                key={activeStory.id}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                className="absolute inset-0"
                            >
                                <Image src={activeStory.image} alt={activeStory.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

                                <div className="absolute bottom-16 left-8 right-8 text-white space-y-6">
                                    <h2 className="font-fashion-serif text-4xl italic font-black leading-tight tracking-tighter">
                                        {activeStory.title}
                                    </h2>
                                    <p className="text-white/70 font-medium text-sm leading-relaxed line-clamp-3 italic">
                                        {activeStory.content}
                                    </p>

                                    <Link
                                        href={`/product/${activeStory.slug}`}
                                        onClick={closeStory}
                                        className="w-full py-5 bg-white text-black text-center text-[11px] font-bold uppercase tracking-[0.3em] active:scale-95 transition-transform inline-block group"
                                    >
                                        Shop Piece
                                        <ChevronRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
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
