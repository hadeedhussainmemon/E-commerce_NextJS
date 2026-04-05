"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Sparkles, Zap, Award } from 'lucide-react';
import Image from 'next/image';

const Stats = [
    { label: 'Curated Pieces', value: '1,200+' },
    { label: 'Global Community', value: '45k' },
    { label: 'Destinations', value: '120+' },
    { label: 'Years of Style', value: '12' },
];

const Values = [
    {
        icon: <Shield size={24} strokeWidth={1} />,
        title: "Artisanal Integrity",
        desc: "Every piece in our collection is hand-selected to ensure the highest standards of quality and craftsmanship."
    },
    {
        icon: <Target size={24} strokeWidth={1} />,
        title: "Curated Vision",
        desc: "We prioritize curated excellence over mass production, bringing you unique pieces from around the globe."
    },
    {
        icon: <Sparkles size={24} strokeWidth={1} />,
        title: "Sustainable Mindset",
        desc: "We value pieces that are designed to last, promoting a more considered and sustainable approach to fashion."
    }
];

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
                        alt="Our Aesthetic"
                        fill
                        className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.5em] mb-6 block">Our Story</span>
                        <h1 className="font-fashion-serif text-5xl md:text-8xl italic font-black text-white leading-tight tracking-tighter mb-8">
                            Curating The <br />
                            Modern Lifestyle
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto">
                            Since 2012, CoolCache has been a sanctuary for those who seek minimalist elegance and sophisticated style.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-32 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {Stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <h4 className="font-fashion-serif text-4xl md:text-6xl italic font-black text-black mb-4">{stat.value}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <h2 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black leading-tight tracking-tighter">
                            Beyond Fashion. <br />
                            <span className="text-gray-200">Architecting Legacies.</span>
                        </h2>
                        <div className="space-y-6 text-gray-500 font-medium leading-relaxed text-base">
                            <p>
                                What began as a small collection of curated pieces has evolved into a global destination for those who value simplicity and sophistication. CoolCache was born from a singular belief: that effortless style should be accessible to everyone.
                            </p>
                            <p>
                                Every item in our catalog is thoughtfully selected. We don't believe in fast fashion; we believe in "forever pieces." If it doesn't meet our rigorous standards of design and durability, it doesn't make the cut.
                            </p>
                        </div>
                        <div className="flex gap-8 border-t border-gray-100 pt-12">
                            <div>
                                <h4 className="font-bold text-black text-[11px] uppercase tracking-[0.2em] mb-2">Quality First</h4>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Global Sourcing</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-black text-[11px] uppercase tracking-[0.2em] mb-2">Fast Transit</h4>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Global Logistics</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-[4/5] overflow-hidden"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=1200"
                            alt="The Atelier"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-32 bg-gray-50/30 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.5em] mb-6 block">Our Essence</span>
                        <h2 className="font-fashion-serif text-4xl md:text-6xl italic font-black text-black tracking-tighter">Core Principles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {Values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="inline-block pb-8 border-b border-black mb-10 text-black">
                                    {value.icon}
                                </div>
                                <h3 className="text-[11px] font-bold text-black mb-6 uppercase tracking-[0.3em]">{value.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto text-sm">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
