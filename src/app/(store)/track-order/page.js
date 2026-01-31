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
        setTimeout(() => {
            setIsSearching(false);
            alert(`Tracking feature coming soon! You searched for: ${orderId}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-20">
                    <div className="inline-block pb-6 border-b border-black mb-10">
                        <Truck size={40} strokeWidth={1} className="text-black" />
                    </div>
                    <h1 className="font-fashion-serif text-5xl md:text-6xl italic font-black text-black tracking-tighter mb-4">Track Order</h1>
                    <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                        Enter your order reference number to view the current status of your shipment.
                    </p>
                </div>

                <div className="bg-gray-50/50 p-8 md:p-12 border border-gray-50 mb-20">
                    <form onSubmit={handleTrack} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-black uppercase tracking-[0.3em]">Order Identifier</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="E.G. #ORD-123456"
                                    className="w-full pl-0 pr-4 py-4 bg-transparent border-b border-gray-200 focus:border-black outline-none font-bold text-lg uppercase transition-all placeholder:text-gray-200 tracking-widest"
                                />
                                <Package className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200" size={20} strokeWidth={1.5} />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !orderId}
                            className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center gap-3"
                        >
                            {isSearching ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Track Shipment</span>
                                    <Search size={16} strokeWidth={2} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Tracking Steps */}
                <div className="relative">
                    <div className="absolute top-7 left-0 w-full h-px bg-gray-100 hidden md:block"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center">
                        {[
                            { icon: CheckCircle, label: 'Confirmed', desc: 'Order is verified' },
                            { icon: Package, label: 'Processing', desc: 'Quality assurance' },
                            { icon: Truck, label: 'In Transit', desc: 'Out for delivery' }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-white border border-gray-100 flex items-center justify-center mb-6 ring-8 ring-white">
                                    <step.icon className="text-black" size={24} strokeWidth={1} />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-1">{step.label}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
