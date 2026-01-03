"use client";

import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleTrack = (e) => {
        e.preventDefault();
        if (!orderId) return;
        setIsSearching(true);
        // Mimic search delay
        setTimeout(() => {
            setIsSearching(false);
            alert(`Tracking feature coming soon! You searched for: ${orderId}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col items-center">
            <div className="max-w-xl w-full px-4">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck size={40} className="text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Track Your Order</h1>
                    <p className="text-slate-500">
                        Enter your order ID below to check the current status of your shipment.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Order ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g., ORD-123456"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono uppercase"
                                />
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !orderId}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSearching ? 'Tracking...' : 'Track Order'}
                        </button>
                    </form>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                            <CheckCircle className="text-emerald-500" size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Order Placed</h3>
                        <p className="text-xs text-slate-400 mt-1">We receive your order</p>
                    </div>
                    <div className="p-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                            <Package className="text-sky-500" size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Processing</h3>
                        <p className="text-xs text-slate-400 mt-1">We pack your items</p>
                    </div>
                    <div className="p-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                            <Truck className="text-indigo-500" size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Delivered</h3>
                        <p className="text-xs text-slate-400 mt-1">Arrives at your door</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
