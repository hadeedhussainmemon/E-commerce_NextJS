"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram, Facebook } from 'lucide-react';
import { triggerPremiumFeedback } from '../../utils/feedback';

export default function ContactUs() {
    const [formState, setFormState] = useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormState('sending');
        triggerPremiumFeedback('pop', 'medium');

        setTimeout(() => {
            setFormState('sent');
            triggerPremiumFeedback('success', 'heavy');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-20">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Info Column */}
                    <div className="lg:col-span-5 space-y-12">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block"
                            >
                                Establish Connection
                            </motion.span>
                            <h1 className="text-5xl md:text-7xl font-playfair font-black text-white italic leading-tight">
                                Reach the <br />
                                <span className="text-emerald-500">Vanguard</span>
                            </h1>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                    <Mail className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Digital Protocol</p>
                                    <p className="text-xl text-white font-bold tracking-tight">hello@vanguard-os.co</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                    <Phone className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Direct Line</p>
                                    <p className="text-xl text-white font-bold tracking-tight">+1 (888) VANGUARD</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                    <MapPin className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Main Atelier</p>
                                    <p className="text-xl text-white font-bold tracking-tight">335 Vanguard Plaza, Metro City</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">Social Nodes</h4>
                            <div className="flex gap-4">
                                {[Twitter, Instagram, Facebook].map((Icon, i) => (
                                    <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all active:scale-95">
                                        <Icon size={20} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Form decorative background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Codename / Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter your identity"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-700 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Neural Address / Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="identity@server.co"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-700 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Transmission Priority</label>
                                    <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold appearance-none cursor-pointer">
                                        <option className="bg-slate-900">Standard Inquiry</option>
                                        <option className="bg-slate-900">Urgent Support</option>
                                        <option className="bg-slate-900">Partnership Proposal</option>
                                        <option className="bg-slate-900">Media Request</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Transmission Payload / Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Type your transmission here..."
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-700 font-bold resize-none"
                                    />
                                </div>

                                <button
                                    disabled={formState !== 'idle'}
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-3xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-emerald-900/40 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {formState === 'idle' && <>Initiate Transmission <Send size={18} /></>}
                                        {formState === 'sending' && <>Sending... <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>}
                                        {formState === 'sent' && <>Transmission Delivered <MessageSquare size={18} /></>}
                                    </span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
