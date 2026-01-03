"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Sparkles, Zap, Award } from 'lucide-react';
import Image from 'next/image';

const Stats = [
    { label: 'Exquisite Pieces', value: '1,200+' },
    { label: 'Happy Connoisseurs', value: '45k' },
    { label: 'Global Destinations', value: '120+' },
    { label: 'Years of Excellence', value: '12' },
];

const Values = [
    {
        icon: <Shield className="w-8 h-8 text-emerald-500" />,
        title: "Uncompromising Integrity",
        desc: "Every piece in our collection undergoes a rigorous multi-point authentication process by industry veterans."
    },
    {
        icon: <Target className="w-8 h-8 text-emerald-500" />,
        title: "The Vanguard Vision",
        desc: "We don't just follow trends; we define them. Our curation team spans 5 continents to find the unique and the bold."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-emerald-500" />,
        title: "Artisanal Heritage",
        desc: "We prioritize craftsmanship over mass production, partnering with ateliers that preserve centuries-old techniques."
    }
];

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
                        alt="Our Atelier"
                        fill
                        className="object-cover opacity-40 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Our Narrative</span>
                        <h1 className="text-5xl md:text-7xl font-playfair font-black text-white italic mb-6">
                            Defining the <span className="text-emerald-500">Vanguard</span> Standard
                        </h1>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed">
                            Since 2012, we have curated a sanctuary for those who seek the extraordinary.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-950 border-b border-white/5">
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
                                <h4 className="text-4xl md:text-5xl font-playfair font-black text-white mb-2">{stat.value}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-playfair font-black text-slate-900 leading-tight">
                            Beyond Curating. <br />
                            <span className="italic text-emerald-600">We Architect Legacies.</span>
                        </h2>
                        <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                            <p>
                                What began as a small boutique for rare horological pieces has evolved into a global destination for curated lifestyle excellence. Vanguard was born from the belief that simplicity is the ultimate sophistication.
                            </p>
                            <p>
                                Every item in our catalog is personally vetted. We don't believe in the "everything store" model. We believe in the "only the best" model. If it doesn't meet our standards of craftsmanship, innovation, and aesthetic value, it doesn't make the cut.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 flex-1">
                                <Award className="w-10 h-10 text-emerald-600 mb-3" />
                                <h4 className="font-black text-slate-900 text-sm">Certified Quality</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Global Standards</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex-1">
                                <Zap className="w-10 h-10 text-slate-900 mb-3" />
                                <h4 className="font-black text-slate-900 text-sm">Instant Access</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Fast Logistics</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1556740734-79383679198c?auto=format&fit=crop&q=80&w=800"
                            alt="The Vanguard Workspace"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply" />
                    </motion.div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em] mb-4 block">Core Identity</span>
                        <h2 className="text-3xl md:text-5xl font-playfair font-black text-slate-900 italic">Our Principles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-200 transition-all duration-500 group"
                            >
                                <div className="p-4 w-16 h-16 rounded-2xl bg-emerald-50 mb-6 group-hover:scale-110 transition-transform">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{value.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
