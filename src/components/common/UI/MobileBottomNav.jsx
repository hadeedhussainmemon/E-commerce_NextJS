"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { getCartItemsCount, toggleCart } = useCart();
    const cartCount = getCartItemsCount();

    const navItems = [
        { icon: Home, label: 'Home', href: '/', active: pathname === '/' },
        { icon: Grid3x3, label: 'Categories', href: '/categories', active: pathname === '/categories' },
        { icon: ShoppingCart, label: 'Cart', action: 'cart', count: cartCount, active: false },
        { icon: User, label: 'Account', href: '/my-orders', active: pathname === '/my-orders' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.active;

                    if (item.action === 'cart') {
                        return (
                            <button
                                key={item.label}
                                onClick={toggleCart}
                                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95"
                            >
                                <div className="relative">
                                    <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-600' : 'text-slate-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.count > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center"
                                        >
                                            {item.count > 9 ? '9+' : item.count}
                                        </motion.span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-slate-600'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95"
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-600' : 'text-slate-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-slate-600'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
