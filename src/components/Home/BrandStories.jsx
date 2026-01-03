"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { triggerPremiumFeedback } from '../../utils/feedback';

const STORIES = [
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
    },
    {
        id: 'luxury-set',
        title: 'Luxury Sets',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        content: 'Curated sets for the ultimate statement.',
    },
    {
        id: 'craftsmanship',
        title: 'Our Craft',
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800',
        content: 'Handmade with love and extreme attention to detail.',
    }
];

export default function BrandStories() {
    const [activeStory, setActiveStory] = useState(null);
    const [progress, setProgress] = useState(0);

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
                        const currentIndex = STORIES.findIndex(s => s.id === activeStory.id);
                        if (currentIndex < STORIES.length - 1) {
                            setActiveStory(STORIES[currentIndex + 1]);
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
    }, [activeStory]);

    return (
        <div className="w-full mb-12">
            {/* Story Circles */}
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {STORIES.map((story) => (
                    <button
                        key={story.id}
                        onClick={() => openStory(story)}
                        className="flex flex-col items-center gap-2 group shrink-0"
                    >
                        <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 active:scale-90 transition-transform">
                            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-100 relative">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">
                            {story.title}
                        </span>
                    </button>
                ))}
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
                            <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                                {STORIES.map((story, idx) => {
                                    const activeIdx = STORIES.findIndex(s => s.id === activeStory.id);
                                    let w = "0%";
                                    if (idx < activeIdx) w = "100%";
                                    if (idx === activeIdx) w = `${progress}%`;

                                    return (
                                        <div key={story.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
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
                                    <p className="text-white/80 font-medium">{activeStory.content}</p>
                                    <button
                                        onClick={() => {
                                            triggerPremiumFeedback('success', 'medium');
                                            closeStory();
                                        }}
                                        className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-transform"
                                    >
                                        Explore Collection
                                    </button>
                                </div>
                            </motion.div>

                            {/* Navigation Taps */}
                            <div className="absolute inset-0 z-10 flex">
                                <div
                                    className="w-1/3 h-full cursor-west-resize"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const idx = STORIES.findIndex(s => s.id === activeStory.id);
                                        if (idx > 0) {
                                            setActiveStory(STORIES[idx - 1]);
                                            setProgress(0);
                                        }
                                    }}
                                />
                                <div
                                    className="w-2/3 h-full cursor-east-resize"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const idx = STORIES.findIndex(s => s.id === activeStory.id);
                                        if (idx < STORIES.length - 1) {
                                            setActiveStory(STORIES[idx + 1]);
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
        </div>
    );
}
