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
        <div className="min-h-screen pt-28 pb-20 bg-slate-50 flex flex-col items-center">
            <div className="max-w-2xl w-full px-4">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10 border border-emerald-50">
                        <Truck size={40} className="text-emerald-600 animate-bounce-slow" />
                    </div>
                    <h1 className="text-4xl font-playfair font-bold text-slate-900 mb-4 tracking-tight">Track Your Journey</h1>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">
                        Enter your order reference number to see real-time updates on your delivery.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>

                    <form onSubmit={handleTrack} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Order ID (Look in your SMS/Email)</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. #ORD-123456"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-mono text-lg uppercase outline-none"
                                />
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !orderId}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group active:scale-[0.98]"
                        >
                            {isSearching ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Syncing with Courier...</span>
                                </>
                            ) : (
                                <>
                                    <span>Track Order</span>
                                    <Search size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Tracking Steps Visualization */}
                <div className="mt-16 relative">
                    {/* Progress Bar Line */}
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 hidden md:block"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {[
                            { icon: CheckCircle, label: 'Order Placed', desc: 'Verified & Confirmed', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
                            { icon: Package, label: 'Processing', desc: 'Quality Check & Pack', color: 'text-sky-500', bg: 'bg-sky-50 border-sky-100' },
                            { icon: Truck, label: 'In Transit', desc: 'On its way to you', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className={`w-14 h-14 ${step.bg} rounded-3xl border flex items-center justify-center mb-4 shadow-sm transition-transform group-hover:-translate-y-1`}>
                                    <step.icon className={step.color} size={28} />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">{step.label}</h3>
                                <p className="text-xs text-slate-400 font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
