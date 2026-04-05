'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
            <div className="flex gap-4 mb-20">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            height: [20, 60, 20],
                            backgroundColor: ["#1e293b", "#10b981", "#1e293b"] 
                        }}
                        transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                        className="w-2 rounded-full bg-slate-800"
                    />
                ))}
            </div>

            <div className="text-center space-y-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.6em] text-emerald-500 animate-pulse">
                    Synchronizing Intelligence
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Acquiring real-time metrics...
                </p>
            </div>

            {/* Grid background effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>
        </div>
    );
}
