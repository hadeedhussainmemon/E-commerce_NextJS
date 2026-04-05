"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCartAnimation } from '@/context/CartAnimationContext';
import getImageUrl from '@/utils/imageUrl';
import config from '@/config';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const { addToCart, isInCart, openCart } = useCart();
    const { startAnimation } = useCartAnimation();
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

    if (!isOpen) return null;

    const handleAddToCart = (e) => {
        addToCart({ ...product, selectedOptions: { color: selectedColor } });

        const img = document.getElementById(`quickview-img-${product.id}`);
        if (img) {
            startAnimation(img.getBoundingClientRect(), getImageUrl(product.image));
        }

        setTimeout(() => {
            onClose();
            openCart();
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-10 p-2 hover:rotate-90 transition-transform duration-300"
                        >
                            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-0 relative">
                            <div className="relative w-full aspect-[3/4]">
                                <Image
                                    id={`quickview-img-${product.id}`}
                                    src={getImageUrl(product.image)}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col overflow-y-auto">
                            <div className="mb-8">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 block">
                                    {product.category}
                                </span>
                                <h1 className="font-fashion-serif text-4xl md:text-5xl italic font-black text-black leading-tight tracking-tighter mb-6">
                                    {product.title}
                                </h1>
                                <div className="text-2xl font-fashion-sans font-light tracking-tight text-black">
                                    {config.currency.symbol}{product.price.toLocaleString()}
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 pb-10 border-b border-gray-100">
                                {product.description}
                            </p>

                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-10">
                                    <span className="text-[11px] font-bold text-black uppercase tracking-[0.2em] block mb-6">Select Color</span>
                                    <div className="flex gap-4">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full border transition-all relative ${selectedColor === color ? 'border-black scale-110' : 'border-transparent hover:border-gray-200'}`}
                                            >
                                                <span
                                                    className="absolute inset-1 rounded-full shadow-inner"
                                                    style={{ backgroundColor: color }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto space-y-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] py-5 hover:bg-gray-900 transition-colors active:scale-95"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => window.location.href = `/product/${product.slug || product.id}`}
                                    className="w-full text-black text-[10px] font-bold uppercase tracking-[0.3em] py-4 border border-transparent hover:border-gray-100 transition-all"
                                >
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
