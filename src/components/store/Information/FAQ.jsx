"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FAQS = [
    {
        q: "Are the pieces authentic?",
        a: "Every item in our collection is hand-vetted for quality and authenticity by our team of specialists."
    },
    {
        q: "What is your return policy?",
        a: "We offer returns within 30 days of delivery for a full refund or store credit, provided the items are in original condition."
    },
    {
        q: "How do I track my order?",
        a: "Once your order ships, you will receive a tracking number via email to monitor your shipment's status."
    }
];

export default function FAQ() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-24">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.5em] mb-6 block">Help Center</span>
                    <h1 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black tracking-tighter">Frequently Asked</h1>
                </div>

                <div className="space-y-12">
                    {FAQS.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="border-b border-gray-100 pb-12"
                        >
                            <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.3em] mb-6 flex items-start gap-6">
                                <span className="text-gray-200">Q.</span> {faq.q}
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed max-w-2xl pl-12">
                                {faq.a}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
