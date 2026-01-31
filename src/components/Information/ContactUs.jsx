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

        setTimeout(() => {
            setFormState('sent');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Info Column */}
                    <div className="lg:col-span-5 space-y-16">
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-6 block">
                                Contact Us
                            </span>
                            <h1 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black leading-tight tracking-tighter">
                                Let's Start A <br />
                                Conversation
                            </h1>
                        </div>

                        <div className="space-y-12">
                            <div className="flex gap-8 group">
                                <div className="w-12 h-12 border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-black transition-all">
                                    <Mail size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Us</p>
                                    <p className="text-xl text-black font-medium tracking-tight">hello@petalpluspup.com</p>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-12 h-12 border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-black transition-all">
                                    <Phone size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Call Us</p>
                                    <p className="text-xl text-black font-medium tracking-tight">+1 (555) 000-0000</p>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-12 h-12 border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-black transition-all">
                                    <MapPin size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Visit Our Atelier</p>
                                    <p className="text-xl text-black font-medium tracking-tight">123 Fashion Ave, Suite 456, New York</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 border-t border-gray-100">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">Follow Our Journey</h4>
                            <div className="flex gap-6">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <button key={i} className="text-gray-400 hover:text-black transition-colors">
                                        <Icon size={20} strokeWidth={1.5} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        <div className="bg-gray-50/50 p-8 md:p-16 border border-gray-50">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black">Your Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full bg-transparent border-b border-gray-200 py-4 text-black outline-none focus:border-black transition-all placeholder:text-gray-300 font-medium text-sm"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="w-full bg-transparent border-b border-gray-200 py-4 text-black outline-none focus:border-black transition-all placeholder:text-gray-300 font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Inquiry Type</label>
                                    <div className="relative">
                                        <select className="w-full bg-transparent border-b border-gray-200 py-4 text-black outline-none focus:border-black transition-all font-medium text-sm appearance-none cursor-pointer">
                                            <option>General Inquiry</option>
                                            <option>Order Support</option>
                                            <option>Press & Media</option>
                                            <option>Partnerships</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <MessageSquare size={16} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="How can we help you?"
                                        className="w-full bg-transparent border-b border-gray-200 py-4 text-black outline-none focus:border-black transition-all placeholder:text-gray-300 font-medium text-sm resize-none"
                                    />
                                </div>

                                <button
                                    disabled={formState !== 'idle'}
                                    className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        {formState === 'idle' && <>Send Message <Send size={16} /></>}
                                        {formState === 'sending' && <>Sending... <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>}
                                        {formState === 'sent' && <>Message Sent <MessageSquare size={16} /></>}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
