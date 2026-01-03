"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FAQS = [
    {
        q: "How are Vanguard masterpieces authenticated?",
        a: "Every entity undergoes a multi-layer verification process at our main laboratory using digital and physical forensics."
    },
    {
        q: "What is the Magic Description Generator?",
        a: "It's our proprietary neural engine that architectures cinematic narratives for every masterpiece based on its specific attributes."
    },
    {
        q: "Do you offer physical maintenance?",
        a: "We partner with local ateliers in major sectors to provide lifetime maintenance for all horological and leather assets."
    }
];

export default function FAQ() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4 block">Knowledge Matrix</span>
                    <h1 className="text-4xl md:text-5xl font-playfair font-black text-slate-900 italic">Frequently Queried</h1>
                </div>

                <div className="space-y-6">
                    {FAQS.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-start gap-4">
                                <span className="text-emerald-500">Q.</span> {faq.q}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed pl-8 border-l-2 border-emerald-100">
                                {faq.a}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
