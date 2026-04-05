"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyCart = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-40 px-6"
    >
        <div className="w-24 h-24 mb-12 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-200" strokeWidth={1} />
        </div>
        <h3 className="font-fashion-serif text-4xl italic font-black text-black mb-8 tracking-tighter">
            Your Bag is Empty
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-12 leading-relaxed font-medium">
            Discover the latest arrivals and curated essentials for your modern lifestyle.
        </p>
        <Link
            href="/"
            className="px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all font-fashion-sans"
        >
            Explore Collections
        </Link>
    </motion.div>
);

export const EmptySearchResults = ({ query }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-40 px-6"
    >
        <div className="w-24 h-24 mb-12 flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-200" strokeWidth={1} />
        </div>
        <h3 className="font-fashion-serif text-4xl italic font-black text-black mb-8 tracking-tighter">
            No Results
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-12 leading-relaxed font-medium">
            We couldn't find any pieces matching <span className="font-bold text-black italic">"{query}"</span>. Please try an alternative search.
        </p>
        <Link
            href="/"
            className="px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
        >
            View All Pieces
        </Link>
    </motion.div>
);

export const EmptyWishlist = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-40 px-6"
    >
        <div className="w-24 h-24 mb-12 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </div>
        <h3 className="font-fashion-serif text-4xl italic font-black text-black mb-8 tracking-tighter">
            Your Wishlist is Empty
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-12 leading-relaxed font-medium">
            Curate your personal selection of the pieces you admire most.
        </p>
        <Link
            href="/"
            className="px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
        >
            Start Curating
        </Link>
    </motion.div>
);

export const EmptyOrders = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-40 px-6"
    >
        <div className="w-24 h-24 mb-12 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-200" strokeWidth={1} />
        </div>
        <h3 className="font-fashion-serif text-4xl italic font-black text-black mb-8 tracking-tighter">
            No Orders Yet
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-12 leading-relaxed font-medium">
            You haven't placed any orders yet. Begin your journey with us today.
        </p>
        <Link
            href="/"
            className="px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
        >
            Explore Home
        </Link>
    </motion.div>
);
