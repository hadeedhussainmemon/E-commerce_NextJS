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
            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-slate-50">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={48} className="text-rose-400 fill-rose-100" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Your wishlist is empty</h1>
                <p className="text-slate-500 mb-8 max-w-md text-center">
                    Save items you love here to buy later.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium flex items-center gap-2"
                >
                    <span>Continue Shopping</span>
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Heart className="text-rose-500 fill-rose-500" />
                    My Wishlist
                    <span className="text-lg font-normal text-slate-500">({wishlistItems.length} items)</span>
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="aspect-square bg-slate-100 relative">
                                <Link href={`/product/${item.slug}`}>
                                    <Image
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-rose-500 hover:bg-rose-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="p-4">
                                <Link href={`/product/${item.slug}`} className="font-semibold text-slate-900 line-clamp-1 hover:text-emerald-600 mb-1">
                                    {item.title}
                                </Link>
                                <p className="font-bold text-slate-900">Rs. {(item.price || 0).toLocaleString()}</p>
                                <Link
                                    href={`/product/${item.slug}`}
                                    className="mt-3 block w-full py-2 bg-slate-900 text-white text-center rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                                >
                                    View Product
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
