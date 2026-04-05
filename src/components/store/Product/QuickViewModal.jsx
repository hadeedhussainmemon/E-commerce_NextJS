"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Heart, ExternalLink } from 'lucide-react';
import getImageUrl from '../../utils/imageUrl';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { triggerPremiumFeedback } from '../../utils/feedback';
import { NewBadge, SaleBadge } from '../UI/ProductBadges';
import { isNewProduct, isOnSale, getDiscountPercentage } from '../../utils/productUtils';

export default function QuickViewModal({ product, isOpen, onClose }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart, isInCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!product) return null;

    const images = Array.isArray(product.image) ? product.image : [product.image];
    const inCart = isInCart(product.id);
    const inWishlist = isInWishlist(product.id);
    const showNewBadge = isNewProduct(product.createdAt);
    const showSaleBadge = isOnSale(product.price, product.originalPrice);
    const discount = getDiscountPercentage(product.price, product.originalPrice);

    const handleAddToCart = () => {
        addToCart(product);
        triggerPremiumFeedback('success', 'medium');
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product);
        triggerPremiumFeedback('pop', 'light');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        >
                            <div className="grid md:grid-cols-2 h-full max-h-[90vh]">
                                {/* Left: Images */}
                                <div className="relative bg-slate-50 p-8">
                                    {showNewBadge && <NewBadge />}
                                    {showSaleBadge && <SaleBadge discount={discount} />}

                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Main Image */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={getImageUrl(images[selectedImage])}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedImage(idx)}
                                                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent'
                                                        }`}
                                                >
                                                    <Image
                                                        src={getImageUrl(img)}
                                                        alt={`${product.title} ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Details */}
                                <div className="p-8 overflow-y-auto">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-display font-black text-slate-900 mb-3 leading-tight">
                                            {product.title}
                                        </h2>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl font-black text-emerald-600">
                                                Rs. {product.price?.toLocaleString()}
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-lg text-slate-400 line-through">
                                                    Rs. {product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        {product.category && (
                                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                                {Array.isArray(product.category) ? product.category[0] : product.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Description</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {product.description || 'No description available.'}
                                        </p>
                                    </div>

                                    {product.material && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Material</h3>
                                            <p className="text-slate-600">{product.material}</p>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Availability</h3>
                                        <p className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className="flex-1 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {inCart ? 'In Cart' : 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={handleToggleWishlist}
                                            className={`px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${inWishlist
                                                    ? 'bg-rose-500 text-white hover:bg-rose-400'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>

                                    <Link
                                        href={`/product/${product.id}`}
                                        className="mt-4 w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        View Full Details
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
