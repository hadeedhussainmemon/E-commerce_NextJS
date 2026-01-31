"use client";

import React from 'react';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import getImageUrl from '../../../utils/imageUrl';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const cart = cartItems;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-12 px-6 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-10">
                    <ShoppingBag size={32} strokeWidth={1} className="text-gray-300" />
                </div>
                <h1 className="font-fashion-serif text-4xl italic font-black text-black mb-4">Your Bag is Empty</h1>
                <p className="text-gray-500 text-sm font-medium mb-12 max-w-xs text-center leading-relaxed">
                    Discovery is just a click away. Explore our latest arrivals and find your new favorites.
                </p>
                <Link
                    href="/"
                    className="px-12 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
                >
                    Start Discovering
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                    <h1 className="font-fashion-serif text-5xl md:text-6xl italic font-black text-black tracking-tighter">
                        Your Bag
                    </h1>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400">
                        {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="border-t border-gray-100">
                            {cart.map((item) => (
                                <div key={item.id} className="py-12 border-b border-gray-100 flex gap-8">
                                    {/* Image */}
                                    <div className="w-32 h-40 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 relative">
                                        <Image
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between pt-2">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                        {item.category}
                                                    </span>
                                                    <Link href={`/product/${item.slug}`} className="block font-fashion-serif text-xl italic font-black text-black hover:opacity-70 transition-opacity">
                                                        {item.title}
                                                    </Link>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-300 hover:text-black transition-colors"
                                                >
                                                    <Trash2 size={18} strokeWidth={1.5} />
                                                </button>
                                            </div>

                                            {item.selectedOptions?.color && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Color:</span>
                                                    <div className="w-3 h-3 rounded-full border border-gray-100" style={{ background: item.selectedOptions.color }} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-8">
                                            <div className="flex items-center gap-6 border border-gray-100 px-4 py-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="text-gray-400 hover:text-black transition-colors disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-gray-400 hover:text-black transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-black font-fashion-sans">
                                                    {config.currency.symbol} {((item.price || 0) * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 p-10 space-y-10 sticky top-32">
                            <div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black mb-8 border-b border-gray-200 pb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-medium text-gray-500">
                                        <span className="uppercase tracking-widest">Subtotal</span>
                                        <span>{config.currency.symbol} {getCartTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-gray-500">
                                        <span className="uppercase tracking-widest">Shipping</span>
                                        <span className="text-black font-bold uppercase tracking-widest">Free</span>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-baseline">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">Total</span>
                                        <span className="text-2xl font-bold text-black font-fashion-sans">
                                            {config.currency.symbol} {getCartTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors active:scale-[0.99]">
                                    Proceed To Checkout
                                </button>
                                <Link href="/" className="block text-center text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                                    Tax included and shipping calculated at checkout.<br />
                                    Secure and encrypted payments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
