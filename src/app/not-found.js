"use client";

import Link from 'next/link';
import config from '@/config';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-white">
            <div className="relative mb-8">
                <h1 className="text-9xl font-black text-slate-100 select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-slate-900 bg-white px-4">
                        Page Not Found
                    </span>
                </div>
            </div>

            <p className="max-w-md text-slate-600 mb-10 text-lg">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                    Return to Home
                </Link>
                <Link
                    href="/contact-us"
                    className="px-8 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                >
                    Contact Support
                </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 max-w-lg w-full">
                <p className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-semibold">Popular Destinations</p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-emerald-600">
                    <Link href="/new-arrivals" className="hover:underline hover:text-emerald-700">New Arrivals</Link>
                    <Link href="/best-sellers" className="hover:underline hover:text-emerald-700">Best Sellers</Link>
                    <Link href="/track-order" className="hover:underline hover:text-emerald-700">Track Order</Link>
                </div>
            </div>
        </div>
    );
}
