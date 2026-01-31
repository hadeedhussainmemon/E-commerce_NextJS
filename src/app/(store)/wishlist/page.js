"use client";

import React from 'react';
import { useWishlist } from '../../../context/WishlistContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Heart, ArrowRight } from 'lucide-react';
import getImageUrl from '../../../utils/imageUrl';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-12 px-6 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-10">
                    <Heart size={32} strokeWidth={1} className="text-gray-300" />
                </div>
                <h1 className="font-fashion-serif text-4xl italic font-black text-black mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-500 text-sm font-medium mb-12 max-w-xs text-center leading-relaxed">
                    Save your most-loved pieces here. Start exploring our collections to find something special.
                </p>
                <Link
                    href="/"
                    className="px-12 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
                >
                    Explore Now
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                    <h1 className="font-fashion-serif text-5xl md:text-6xl italic font-black text-black tracking-tighter">
                        Favorites
                    </h1>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="group flex flex-col">
                            <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden mb-6">
                                <Link href={`/product/${item.slug}`}>
                                    <Image
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 p-2.5 bg-white text-black hover:bg-black hover:text-white transition-all shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                                    title="Remove from favorites"
                                >
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="space-y-4 flex-1 flex flex-col">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                        {item.category}
                                    </span>
                                    <Link href={`/product/${item.slug}`} className="block font-fashion-serif text-lg italic font-black text-black hover:opacity-70 transition-opacity">
                                        {item.title}
                                    </Link>
                                </div>

                                <p className="text-sm font-bold text-black font-fashion-sans">
                                    Rs. {(item.price || 0).toLocaleString()}
                                </p>

                                <div className="pt-2 mt-auto">
                                    <Link
                                        href={`/product/${item.slug}`}
                                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-1 hover:gap-4 transition-all"
                                    >
                                        View Piece
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
