"use client";

import React from 'react';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import getImageUrl from '../../../utils/imageUrl';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    // Alias cartItems to cart for easier migration inside this file
    const cart = cartItems;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-slate-50">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} className="text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
                <p className="text-slate-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Browse our products to find something you'll love.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium flex items-center gap-2"
                >
                    <span>Start Shopping</span>
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-emerald-600" />
                    Shopping Cart
                    <span className="text-lg font-normal text-slate-500">({cart.length} items)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 sm:gap-6">
                                {/* Image */}
                                <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-100">
                                    <Image
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <Link href={`/product/${item.slug}`} className="font-semibold text-slate-900 line-clamp-2 hover:text-emerald-600">
                                                {item.title}
                                            </Link>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-rose-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1 capitalize">{item.category}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">Rs. {((item.price || 0) * item.quantity).toLocaleString()}</p>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-slate-500">Rs. {(item.price || 0).toLocaleString()} each</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-28">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {getCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-lg text-slate-900">
                                    <span>Total</span>
                                    <span>Rs. {getCartTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform active:scale-[0.98]">
                                Proceed to Checkout
                            </button>

                            <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                                🔒 Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
