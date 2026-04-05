"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Store, ArrowRight, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Zap, Globe, BarChart3, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import config from '@/config';

export default function BecomeSeller() {
    const [step, setStep] = useState(1); // 1: Login/Register, 2: Business Info, 3: Success
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        businessName: ''
    });

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    if (data.user.role === 'seller' || data.user.role === 'superadmin') {
                        router.push('/admin');
                    } else {
                        setStep(2);
                    }
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            }
        };
        checkAuth();
    }, [router]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/admin/login' : '/api/auth/register';
            const payload = isLogin
                ? { username: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                if (isLogin) {
                    if (data.user.role === 'seller' || data.user.role === 'superadmin') {
                        router.push('/admin');
                    } else {
                        setUser(data.user);
                        setStep(2);
                    }
                } else {
                    setIsLogin(true);
                    toast.success('Account created! Please login to continue.');
                }
            } else {
                toast.error(data.error || 'Authentication failed');
            }
        } catch (err) {
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeSeller = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/become-seller', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName: formData.businessName })
            });

            const data = await res.json();

            if (res.ok) {
                setStep(3);
                toast.success('Welcome to the seller community!');
            } else {
                toast.error(data.error || 'Failed to upgrade account');
            }
        } catch (err) {
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: <Globe className="text-emerald-400" />, title: "Global Reach", desc: "Sell to customers worldwide." },
        { icon: <Zap className="text-amber-400" />, title: "Instant Setup", desc: "Go live in minutes." },
        { icon: <BarChart3 className="text-blue-400" />, title: "Analytics", desc: "Track your growth data." },
        { icon: <ShieldCheck className="text-teal-400" />, title: "Secure", desc: "Enterprise grade safety." }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30 overflow-hidden relative font-inter">
            {/* Immersive Neural Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-600/10 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse delay-700"></div>
                <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[140px] animate-pulse delay-1000"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Brand & Benefits */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-xs font-black uppercase tracking-[0.2em]"
                        >
                            <Rocket size={14} className="animate-bounce" />
                            Curator Portal Access
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-fashion-serif italic font-black tracking-tighter leading-[0.9] text-white">
                            CRAFT YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white">LEGACY.</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium max-w-lg leading-relaxed">
                            {config.appName} is the premiere destination for independent designers. Our infrastructure is designed for your artistic growth.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] hover:border-emerald-500/40 transition-all group"
                            >
                                <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {b.icon}
                                </div>
                                <h3 className="font-black uppercase tracking-widest text-sm mb-2">{b.title}</h3>
                                <p className="text-sm text-slate-500 font-medium">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Registration Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Floating elements */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>

                    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

                        {/* Progress Header */}
                        <div className="flex items-center justify-between mb-12 px-2">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                    <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black transition-all duration-700 ${step >= s ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-600'
                                        }`}>
                                        {step > s ? <CheckCircle2 size={24} /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className="flex-1 mx-4 h-1 bg-slate-800 rounded-full relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: step > s ? '100%' : '0%' }}
                                                className="absolute inset-0 bg-emerald-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h2 className="text-3xl font-black tracking-tight mb-2 italic">
                                            {isLogin ? 'WELCOME BACK' : 'START JOURNEY'}
                                        </h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Identity Verification Required</p>
                                    </div>

                                    <form onSubmit={handleAuth} className="space-y-5">
                                        {!isLogin && (
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] ml-2 text-slate-500">Digital Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="FULL NAME..."
                                                        className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:border-emerald-500/40 transition-all font-black uppercase tracking-widest text-xs"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] ml-2 text-slate-500">Neural Link (Email)</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="YOU@EXAMPLE.APP"
                                                    className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:border-emerald-500/40 transition-all font-black uppercase tracking-widest text-xs"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] ml-2 text-slate-500">Cryptographic Key</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:border-emerald-500/40 transition-all font-black tracking-[0.5em] text-xs"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full relative group h-16 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-white/5"
                                        >
                                            <span className="relative z-10 flex items-center gap-3">
                                                {loading ? <Loader2 className="animate-spin text-black" /> : (
                                                    <>
                                                        {isLogin ? 'INITIALIZE ACCESS' : 'CREATE ACCOUNT'}
                                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                                                    </>
                                                )}
                                            </span>
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(!isLogin)}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors"
                                            >
                                                {isLogin ? "SWITCH TO REGISTRATION" : "EXISTING MERCHANT? LOGIN"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h2 className="text-3xl font-black tracking-tight mb-2 italic">ESTABLISH BRAND</h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Merchant Space Assignment</p>
                                    </div>

                                    <form onSubmit={handleBecomeSeller} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] ml-2 text-slate-500">Business Moniker</label>
                                            <div className="relative group">
                                                <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="E.G. APEX KINETICS"
                                                    className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:border-emerald-500/40 transition-all font-black uppercase tracking-widest text-xs"
                                                    value={formData.businessName}
                                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] flex items-start gap-4 backdrop-blur-md">
                                            <ShieldCheck className="text-white shrink-0" size={20} />
                                            <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
                                                Your boutique will be showcased across the {config.appName} collective. Choose a name that reflects your artistry.
                                            </p>
                                        </div>

                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full group h-16 bg-white text-black hover:bg-slate-100 rounded-[1.5rem] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : (
                                                <>
                                                    LAUNCH STORE
                                                    <Store size={20} className="group-hover:scale-110 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-10"
                                >
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                                        <div className="w-32 h-32 bg-emerald-500/20 border border-emerald-500/30 rounded-[2.5rem] flex items-center justify-center relative z-10">
                                            <CheckCircle2 className="text-emerald-500" size={64} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black italic tracking-tighter">ACCESS GRANTED</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Merchant ID: #V{Math.floor(Math.random() * 10000)} Authorized</p>
                                    </div>

                                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                                        Protocol shift complete. You are now integrated into the seller matrix.
                                    </p>

                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
                                    >
                                        ENTER CONTROL CORE
                                        <BarChart3 size={20} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>

            {/* Footer Signifier */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center px-6">
                <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.6em]">
                    {config.appName} Collective Integration // Secure Merchant Channel Alpha-1
                </p>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-pulse {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
