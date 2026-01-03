"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function LegalPage({ title, lastUpdated, children }) {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mb-16"
                >
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Resource Fragment</span>
                    <h1 className="text-4xl md:text-6xl font-playfair font-black text-slate-900">{title}</h1>
                    <p className="text-slate-400 text-sm font-medium">Last Protocol Revision: {lastUpdated}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-slate max-w-none prose-headings:font-playfair prose-headings:font-black prose-headings:italic prose-h2:text-2xl prose-h2:mt-12 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600"
                >
                    {children}
                </motion.div>
            </div>
        </div >
    );
}
