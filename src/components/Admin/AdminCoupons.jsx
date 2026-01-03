import React, { useState, useEffect, useMemo } from 'react';
import { Ticket, Trash2, Plus, Calendar, AlertCircle, Percent, DollarSign, Loader, X, Tag, Copy, Check } from 'lucide-react';
import config from '../../config';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage', // percentage | fixed
        discountValue: '',
        minOrderAmount: '0',
        expiryDate: '',
        usageLimit: ''
    });

    const API_BASE_URL = config.api.baseUrl;

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_BASE_URL}/api/coupons`, { headers });
            if (!response.ok) throw new Error('Failed to fetch coupons');

            const data = await response.json();
            setCoupons(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [API_BASE_URL]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok) throw new Error('Failed to delete coupon');

            setCoupons(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCreating(true);
            const token = localStorage.getItem('adminToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const payload = {
                ...formData,
                usageLimit: formData.usageLimit || null // Send null if empty string
            };

            const response = await fetch(`${API_BASE_URL}/api/coupons`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Failed to create coupon');

            setCoupons(prev => [data, ...prev]);
            setShowAddModal(false);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minOrderAmount: '0',
                expiryDate: '',
                usageLimit: ''
            });
        } catch (err) {
            alert(err.message);
        } finally {
            setCreating(false);
        }
    };

    const isExpired = (dateString) => new Date(dateString) < new Date();

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-playfair font-black text-white mb-2 italic tracking-tight">Voucher Forge</h2>
                    <p className="text-slate-500 font-medium tracking-wide">Generate and encrypt promotional signals</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Forge New Link
                </button>
            </div>

            {error && (
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl text-rose-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                    <AlertCircle size={20} />
                    System Error: {error}
                </div>
            )}

            {/* Coupons Grid */}
            {coupons.length === 0 ? (
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-20 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
                    <div className="w-24 h-24 bg-white/[0.02] rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 border border-white/5">
                        <Ticket size={48} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic mb-3 relative z-10">No Active Transmissions</h3>
                    <p className="text-slate-500 font-medium relative z-10">Initiate your first discount signal to accelerate trajectory.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map(coupon => (
                        <div key={coupon._id} className={`bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border-2 p-6 relative overflow-hidden transition-all hover:bg-slate-900/60 shadow-xl group ${isExpired(coupon.expiryDate) || !coupon.isActive ? 'border-white/5 opacity-60 grayscale' : 'border-emerald-500/10 hover:border-emerald-500/30'}`}>

                            {/* Status Badge */}
                            <div className={`absolute top-6 right-6 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${!coupon.isActive ? 'bg-slate-800 text-slate-500 border-white/5' :
                                isExpired(coupon.expiryDate) ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                }`}>
                                {!coupon.isActive ? 'Inactive' : isExpired(coupon.expiryDate) ? 'Deactivated' : 'Online'}
                            </div>

                            <div className="flex items-center gap-4 mb-6 pt-2">
                                <div className="p-3.5 bg-white/[0.02] text-emerald-400 rounded-2xl border border-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-inner">
                                    <Ticket size={28} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-white tracking-widest uppercase">{coupon.code}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">
                                        <Zap size={10} />
                                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '% Reduction' : ' PKR Offset'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-6 bg-black/20 p-5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Utilization Rate:</span>
                                    <span className="text-white bg-white/5 px-2 py-1 rounded-md">{coupon.usedCount} <span className="text-slate-600">/</span> {coupon.usageLimit || '∞'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Threshold:</span>
                                    <span className="text-white">Rs. {coupon.minOrderAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock size={12} />
                                        Temporal Exit:
                                    </div>
                                    <span className={isExpired(coupon.expiryDate) ? 'text-rose-500' : 'text-emerald-500'}>
                                        {new Date(coupon.expiryDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-center bg-black/40 -mx-6 -mb-6 p-4 border-t border-white/5">
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-600 hover:text-white transition-colors" title="Copy Signal">
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="text-slate-600 hover:text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all group/del"
                                    title="Purge Signal"
                                >
                                    <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Coupon Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
                                <div>
                                    <h3 className="font-black text-2xl text-white italic tracking-tight">Signal Fabrication</h3>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Configure promotional encryption</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Signal ID Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="CRYPTO-FLUX-2026"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none text-white font-black uppercase tracking-widest placeholder:text-slate-700 transition-all"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Magnitude Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:outline-none text-white font-black uppercase tracking-widest appearance-none transition-all"
                                                value={formData.discountType}
                                                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                            >
                                                <option value="percentage">Ratio (%)</option>
                                                <option value="fixed">Flat (PKR)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Yield Value</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:outline-none text-white font-black tracking-widest transition-all"
                                            value={formData.discountValue}
                                            onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Min Threshold</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:outline-none text-white font-black tracking-widest transition-all"
                                            value={formData.minOrderAmount}
                                            onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Entropy Limit</label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="UNLIMITED"
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:outline-none text-white font-black uppercase tracking-widest placeholder:text-slate-800 transition-all"
                                            value={formData.usageLimit}
                                            onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Temporal Expiration</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:outline-none text-white font-black uppercase tracking-widest transition-all [color-scheme:dark]"
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-3 group"
                                    >
                                        {creating ? <Loader className="animate-spin" size={18} /> : (
                                            <>
                                                Deploy Signal
                                                <Zap size={16} className="group-hover:scale-125 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, Clock } from 'lucide-react';
