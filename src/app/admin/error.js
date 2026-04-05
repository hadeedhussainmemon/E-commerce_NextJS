'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({ error, reset }) {
    useEffect(() => {
        console.error('Admin Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-12 max-w-2xl">
                <h1 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-white tracking-tighter mb-8 leading-tight">
                    Systems <br /> Misaligned
                </h1>
                
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 max-w-md mx-auto leading-relaxed">
                    Data synchronization interrupted. <br /> Security and integrity remained intact.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-12 py-5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20"
                    >
                        Re-initialize
                    </button>
                    
                    <Link
                        href="/"
                        className="px-12 py-5 bg-slate-900 border border-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-20 p-8 bg-slate-900/50 border border-slate-800 max-w-3xl text-left relative z-10 backdrop-blur-md">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.4em] mb-4">Core Exception Trace</p>
                    <code className="text-xs text-slate-400 font-mono break-all whitespace-pre-wrap">{error?.stack || error?.message}</code>
                </div>
            )}
        </div>
    );
}
