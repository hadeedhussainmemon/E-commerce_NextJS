"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useProductQuery } from '../../hooks/useProductQuery';
import useTrackProductView from '../../hooks/useTrackProductView';
import SEO from '../SEO/SEO';
import getImageUrl from '../../utils/imageUrl';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import config from '../../config';
import RelatedProducts from './RelatedProducts';
import ProductSkeleton from '../Skeletons/ProductSkeleton';
import { useToast } from '../../context/ToastContext';
import RecentlyViewed from '../RecentlyViewed/RecentlyViewed';
import { motion } from 'framer-motion';
import { triggerPremiumFeedback } from '../../utils/feedback';
import { Share2, ShoppingBag, Truck, ShieldCheck, Check, ArrowLeft } from 'lucide-react';

const ProductDetailClient = ({ slug, initialProduct }) => {
    const router = useRouter();
    const { showToast } = useToast();

    // React Query Fetch with Server Data Hydration
    const { data: product, isLoading: loading, error: queryError } = useProductQuery(slug, initialProduct);
    const error = queryError ? queryError.message : null;

    // Cart Context
    const { addToCart, isInCart, openCart } = useCart();

    // Local State
    const [selectedColor, setSelectedColor] = useState(null);
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Track scroll for sticky bar
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 768) {
                setShowStickyBar(window.scrollY > 500);
            } else {
                setShowStickyBar(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize selected color when product loads
    useEffect(() => {
        if (product?.colors?.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    const API_BASE_URL = config.api.baseUrl;

    if (loading) return <ProductSkeleton />;
    if (error) return <div className="max-w-5xl mx-auto p-6 text-red-600 border border-red-200 rounded-lg bg-red-50">{error}</div>;
    if (!product) return <div className="p-20 text-center text-gray-500">Product not found. <Link href="/" className="text-emerald-600 hover:underline">Go Home</Link></div>;

    const isSoldOut = product.stock === 0;

    const handleWhatsAppShare = () => {
        const shareUrl = `${API_BASE_URL}/api/share/product/${product.id}`;
        const message = `Check out this product: ${product.title}\n\nPrice: Rs. ${product.price}\n\n${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        triggerPremiumFeedback('pop', 'light');
        showToast('Opening WhatsApp...', 'info');
    };

    const handleAddToCart = () => {
        addToCart({ ...product, selectedOptions: { color: selectedColor } });
        triggerPremiumFeedback('pop', 'light');
        showToast(`Added ${product.title} to Cart`, 'success');
    };

    const handleBuyNow = () => {
        if (!isInCart(product.id)) {
            addToCart({ ...product, selectedOptions: { color: selectedColor } });
        }
        triggerPremiumFeedback('success', 'medium');
        setTimeout(() => openCart(), 200);
    };

    const IMAGE_FALLBACK = `${config.api.baseUrl}/og-image.jpg`;
    let imageUrl = product && product.image ? getImageUrl(product.image) : IMAGE_FALLBACK;

    if (imageUrl && !imageUrl.startsWith('http')) {
        if (imageUrl.startsWith('/')) {
            imageUrl = `${config.api.baseUrl}${imageUrl}`;
        }
    }

    const categoryLabel = Array.isArray(product.category) ? product.category[0] : product.category;
    const categorySlug = encodeURIComponent((categoryLabel || '').toLowerCase().replace(/\s+/g, '-'));

    const breadcrumbItems = [
        { name: 'Home', to: '/' },
        { name: categoryLabel || 'Category', to: `/category/${categorySlug}` },
        { name: product.title, to: null }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
            <SEO
                title={`${product.title} | ${config.appName}`}
                description={`Buy ${product.title} - ${String(product.description || '').substring(0, 150)}...`}
                canonical={`${config.api.baseUrl}/product/${product.slug || product.id}`}
                image={imageUrl}
                type="product"
            />

            <div className="mb-6">
                <button
                    onClick={() => {
                        if (window.history.length > 2) {
                            router.back();
                        } else {
                            router.push('/');
                        }
                    }}
                    className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-semibold transition-all group px-3 py-1.5 rounded-full hover:bg-emerald-50 w-fit"
                >
                    <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to shopping
                </button>
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100/50 overflow-hidden"
            >
                {/* Product Image Gallery */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
                        {isSoldOut ? (
                            <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black z-10 shadow-xl uppercase tracking-widest">
                                Sold Out
                            </div>
                        ) : (
                            <div className="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-black z-10 shadow-xl uppercase tracking-widest animate-pulse-soft">
                                In Stock
                            </div>
                        )}
                        <div className="relative w-full h-full p-4 md:p-8 cursor-zoom-in">
                            <Image
                                src={getImageUrl(product.image)}
                                alt={product.title}
                                fill
                                priority
                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="w-20 h-20 rounded-xl border-2 border-emerald-500 p-1 shrink-0 bg-white">
                            <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-50">
                                <Image src={getImageUrl(product.image)} alt="Thumbnail" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2 text-slate-900 leading-tight">{product.title}</motion.h1>
                    <motion.div variants={itemVariants} className="text-gray-500 mb-2 text-sm uppercase tracking-wide font-medium">
                        {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                    </motion.div>

                    {product.material && product.material.toLowerCase() !== 'handmade' && (
                        <motion.div variants={itemVariants} className="text-gray-600 mb-4 text-sm bg-slate-50 inline-block px-2 py-1 rounded border border-slate-200 w-fit">
                            Material: <span className="font-semibold">{product.material}</span>
                        </motion.div>
                    )}

                    {/* Price with Discount */}
                    <motion.div variants={itemVariants} className="mb-8 mt-4">
                        {product.price > 0 ? (
                            <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 ring-1 ring-black/[0.02]">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                                        {config.currency.symbol}{product.price.toLocaleString()}
                                    </div>
                                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                        Save 20%
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg text-slate-400 line-through decoration-slate-300 font-medium">
                                        {config.currency.symbol}{Math.round(product.price / 0.8).toLocaleString()}
                                    </span>
                                    <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-sm text-emerald-600 font-bold">
                                        Offer ending soon
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xl text-slate-500 italic font-medium p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                Contact store for price
                            </div>
                        )}
                    </motion.div>

                    {/* Trust panel */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                            <Truck className="w-4 h-4 text-emerald-500" />
                            Fast Delivery
                        </div>
                        <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            7-Day Returns
                        </div>
                        <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                            <Check className="w-4 h-4 text-emerald-500" />
                            Cash on Delivery
                        </div>
                    </motion.div>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <motion.div variants={itemVariants} className="mb-6">
                            <div className="text-sm font-semibold text-gray-900 mb-3">Select Color:</div>
                            <div className="flex items-center gap-3">
                                {product.colors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedColor(c)}
                                        className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none ${selectedColor === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'ring-1 ring-slate-200'}`}
                                        style={{ background: c }}
                                        aria-label={`Select color ${c}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-8">
                        {product.price === 0 ? (
                            <a
                                href={`https://www.instagram.com/${config.socials.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-2xl text-white bg-slate-900 hover:bg-black flex items-center justify-center gap-3 font-bold shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1 active:scale-95 flex-1"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                Inquire via Instagram
                            </a>
                        ) : (
                            <>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isSoldOut}
                                    className={`flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-900 hover:border-emerald-500 hover:bg-emerald-50 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>
                                {!isSoldOut && (
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-[1.5] px-8 py-4 rounded-2xl text-white bg-slate-900 hover:bg-emerald-600 font-bold shadow-2xl shadow-slate-900/10 transition-all hover:-translate-y-1 active:scale-95"
                                    >
                                        Buy it Now
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-14 h-14 rounded-2xl bg-white border border-slate-100 hover:border-emerald-500 text-slate-400 hover:text-emerald-500 flex items-center justify-center shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1 active:scale-95 shrink-0"
                            aria-label="Share on WhatsApp"
                        >
                            <Share2 size={24} />
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-10 border-t border-slate-100 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Product Details</h3>
                        </div>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                            {product.description}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Recently Viewed */}
            <div className="mt-16">
                <RecentlyViewed />
            </div>

            {/* Related products */}
            <RelatedProducts currentId={product.id} category={product.category} />

            {/* Sticky Mobile Buy Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-slate-100 p-4 transition-transform duration-500 ease-in-out md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)] ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Item</span>
                        <div className="text-sm font-bold text-slate-900 line-clamp-1">{product.title}</div>
                        <div className="text-emerald-700 font-black">{config.currency.symbol} {product.price.toLocaleString()}</div>
                    </div>
                    <button
                        onClick={handleBuyNow}
                        disabled={isSoldOut}
                        className="flex-1 bg-slate-900 text-white rounded-xl py-3 px-6 font-bold shadow-lg shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                    >
                        {isSoldOut ? 'Sold Out' : 'Buy Now'}
                    </button>
                    <button
                        onClick={() => router.push('/cart')}
                        className="relative w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100"
                    >
                        <ShoppingBag size={20} className="text-slate-600" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">1</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailClient;
