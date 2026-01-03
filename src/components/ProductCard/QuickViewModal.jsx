import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useCartAnimation } from '../../context/CartAnimationContext';
import getImageUrl from '../../utils/imageUrl';
import config from '../../config';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const { addToCart, isInCart, openCart } = useCart();
    const { startAnimation } = useCartAnimation(); // Use global animation context
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

    if (!isOpen) return null;

    const handleAddToCart = (e) => {
        addToCart({ ...product, selectedOptions: { color: selectedColor } });

        // Trigger animation
        const img = document.getElementById(`quickview-img-${product.id}`);
        if (img) {
            startAnimation(img.getBoundingClientRect(), getImageUrl(product.image));
        }

        setTimeout(() => {
            onClose();
            openCart(); // Optional: open cart or just stay
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 relative">
                            <div className="relative w-full aspect-square max-w-sm">
                                <Image
                                    id={`quickview-img-${product.id}`}
                                    src={getImageUrl(product.image)}
                                    alt={product.title}
                                    fill
                                    className="object-contain drop-shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                            <div className="mb-4">
                                {product.isTrending && (
                                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                                        🔥 Trending
                                    </span>
                                )}
                                <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-1">{product.title}</h2>
                                <p className="text-sm text-gray-500">{product.category}</p>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    {config.currency.symbol} {product.price.toLocaleString()}
                                </span>
                                {product.price > 0 && (
                                    <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
                                        In Stock
                                    </span>
                                )}
                            </div>

                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-sm font-semibold text-gray-700 block mb-2">Select Color</span>
                                    <div className="flex gap-2">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'ring-2 ring-violet-500 border-white' : 'border-gray-200 hover:border-violet-300'}`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => window.location.href = `/product/${product.id}`}
                                    className="px-4 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    View Details
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
