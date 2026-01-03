"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyCart = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
    >
        <div className="w-32 h-32 mb-8 rounded-full bg-slate-100 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">
            Your Cart is Empty
        </h3>
        <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </p>
        <Link
            href="/"
            className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 uppercase text-xs tracking-wider"
        >
            Start Shopping
        </Link>
    </motion.div>
);

export const EmptySearchResults = ({ query }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
    >
        <div className="w-32 h-32 mb-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">
            No Results Found
        </h3>
        <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
            We couldn't find any products matching <span className="font-bold text-slate-700">"{query}"</span>. Try adjusting your search.
        </p>
        <div className="flex gap-3">
            <Link
                href="/"
                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
                Browse All
            </Link>
            <Link
                href="/categories"
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all"
            >
                View Categories
            </Link>
        </div>
    </motion.div>
);

export const EmptyWishlist = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
    >
        <div className="w-32 h-32 mb-8 rounded-full bg-rose-50 flex items-center justify-center">
            <svg className="w-16 h-16 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </div>
        <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">
            Your Wishlist is Empty
        </h3>
        <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
            Save your favorite items here so you can easily find them later.
        </p>
        <Link
            href="/"
            className="px-8 py-4 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 uppercase text-xs tracking-wider"
        >
            Discover Products
        </Link>
    </motion.div>
);

export const EmptyOrders = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
    >
        <div className="w-32 h-32 mb-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <Package className="w-16 h-16 text-indigo-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">
            No Orders Yet
        </h3>
        <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
            You haven't placed any orders yet. Start shopping to see your order history here.
        </p>
        <Link
            href="/"
            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 uppercase text-xs tracking-wider"
        >
            Start Shopping
        </Link>
    </motion.div>
);
