"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const LOOKBOOK_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
        title: "Modern Minimal",
        category: "Collection '24",
        isLarge: true
    },
    {
        src: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600",
        title: "The Silk Edit",
        category: "Essential Pieces",
        isLarge: false
    },
    {
        src: "https://images.unsplash.com/photo-1539109132332-6b3a3250f585?auto=format&fit=crop&q=80&w=600",
        title: "Abstract Form",
        category: "New Arrivals",
        isLarge: false
    }
];

export default function Lookbook() {
    return (
        <section className="py-40 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
                    <div className="max-w-xl">
                        <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-6 block">The Lookbook</span>
                        <h2 className="font-fashion-serif text-5xl md:text-8xl italic font-black text-black tracking-tighter leading-[0.85]">
                            Aesthetic <br /> Perspectives
                        </h2>
                    </div>
                    <div className="max-w-xs">
                        <p className="text-gray-500 font-medium leading-relaxed mb-8">
                            A curated selection of our most iconic pieces, captured through an editorial lens. Designed for the modern observer.
                        </p>
                        <button className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] group">
                            Explore All <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Large Main Piece */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="md:col-span-7 relative group"
                    >
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                                src={LOOKBOOK_IMAGES[0].src}
                                alt={LOOKBOOK_IMAGES[0].title}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                        <div className="mt-8">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-2">{LOOKBOOK_IMAGES[0].category}</span>
                            <h3 className="font-fashion-serif text-3lx italic font-black text-black">{LOOKBOOK_IMAGES[0].title}</h3>
                        </div>
                    </motion.div>

                    {/* Secondary Stack */}
                    <div className="md:col-span-5 flex flex-col gap-24 pt-24 md:pt-48">
                        {LOOKBOOK_IMAGES.slice(1).map((image, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.2 }}
                                className="relative group"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden ml-auto w-full md:w-5/6">
                                    <Image
                                        src={image.src}
                                        alt={image.title}
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-8 text-right">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-2">{image.category}</span>
                                    <h3 className="font-fashion-serif text-2xl italic font-black text-black">{image.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
