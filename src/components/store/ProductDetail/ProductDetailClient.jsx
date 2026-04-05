"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useProductQuery } from '@/hooks/useProductQuery';
import useTrackProductView from '@/hooks/useTrackProductView';
import getImageUrl from '@/utils/imageUrl';
import Breadcrumb from '@/components/store/Breadcrumb/Breadcrumb';
import config from '@/config';
import RelatedProducts from './RelatedProducts';
import ProductSkeleton from '@/components/common/Skeletons/ProductSkeleton';
import { useToast } from '@/context/ToastContext';
import RecentlyViewed from '@/components/store/RecentlyViewed/RecentlyViewed';
import { Share2, ShoppingBag, Truck, ShieldCheck, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import Magnetic from '@/components/common/UI/Magnetic';

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
    if (!product) return <div className="p-20 text-center text-gray-500 font-fashion-serif italic">Piece not found. <Link href="/" className="text-black underline underline-offset-4 decoration-1">Return Home</Link></div>;

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
            <div className="mb-6">
                <Magnetic>
                    <button
                        onClick={() => {
                            if (window.history.length > 2) {
                                router.back();
                            } else {
                                router.push('/');
                            }
                        }}
                        className="mb-8 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all group"
                    >
                        <ArrowLeft size={16} className="transform group-hover:-translate-x-2 transition-transform" />
                        Back to pieces
                    </button>
                </Magnetic>
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
                            <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 text-[10px] font-bold z-10 uppercase tracking-widest">
                                Sold Out
                            </div>
                        ) : (
                            <div className="absolute top-6 left-6 bg-white border border-gray-100 text-black px-4 py-1.5 text-[10px] font-bold z-10 uppercase tracking-widest">
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
                        <div className="w-20 h-20 rounded-xl border-2 border-black p-1 shrink-0 bg-white shadow-xl">
                            <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-50">
                                <Image src={getImageUrl(product.image)} alt="Thumbnail" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <motion.h1 variants={itemVariants} className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black tracking-tighter leading-none mb-6">
                        {product.title}
                    </motion.h1>
                    <motion.div variants={itemVariants} className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">
                        {Array.isArray(product.category) ? product.category.join(' / ') : product.category}
                    </motion.div>

                    {product.material && product.material.toLowerCase() !== 'handmade' && (
                        <motion.div variants={itemVariants} className="text-gray-600 mb-4 text-sm bg-slate-50 inline-block px-2 py-1 rounded border border-slate-200 w-fit">
                            Material: <span className="font-semibold">{product.material}</span>
                        </motion.div>
                    )}

                    {/* Price with Discount */}
                    <motion.div variants={itemVariants} className="mb-12">
                        {product.price > 0 ? (
                            <div className="flex items-end gap-6">
                                <div className="font-fashion-serif text-6xl italic font-black text-black tracking-tighter">
                                    {config.currency.symbol}{product.price.toLocaleString()}
                                </div>
                                <div className="flex flex-col pb-2">
                                    <span className="text-sm text-gray-300 line-through font-medium">
                                        {config.currency.symbol}{Math.round(product.price / 0.8).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-black uppercase tracking-widest">
                                        20% Special Edition
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xl text-gray-300 italic font-medium py-10 border-y border-gray-100">
                                Contact store for price
                            </div>
                        )}
                    </motion.div>

                    {/* Trust panel */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 border-y border-gray-100 py-10 mb-12 gap-8 text-[10px] font-bold text-black uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-3">
                            <Truck size={18} strokeWidth={1} />
                            Complimentary Delivery
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} strokeWidth={1} />
                            Secure Interaction
                        </div>
                        <div className="flex items-center gap-3">
                            <Check size={18} strokeWidth={1} />
                            Verified Piece
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
                                        className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none ${selectedColor === c ? 'ring-2 ring-offset-2 ring-black scale-110' : 'ring-1 ring-slate-200'}`}
                                        style={{ background: c }}
                                        aria-label={`Select color ${c}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
                        {product.price === 0 ? (
                            <Magnetic>
                                <a
                                    href={`https://www.instagram.com/${config.socials.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-16 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-gray-900 transition-all flex-1"
                                >
                                    Inquire via Instagram
                                </a>
                            </Magnetic>
                        ) : (
                            <>
                                <Magnetic>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isSoldOut}
                                        className={`flex-1 px-8 py-5 border-2 border-black text-black text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 ${isSoldOut ? 'opacity-20 cursor-not-allowed' : ''}`}
                                    >
                                        <ShoppingBag size={18} strokeWidth={1.5} />
                                        Add to Pieces
                                    </button>
                                </Magnetic>
                                {!isSoldOut && (
                                    <Magnetic>
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex-[1.5] px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-gray-900 shadow-2xl shadow-black/10 transition-all active:scale-95"
                                        >
                                            Inquire Now
                                        </button>
                                    </Magnetic>
                                )}
                            </>
                        )}
                        <Magnetic>
                            <button
                                onClick={handleWhatsAppShare}
                                className="w-16 h-16 bg-white border border-gray-100 text-black flex items-center justify-center hover:border-black transition-all active:scale-95 shrink-0"
                                aria-label="Share Piece"
                            >
                                <Share2 size={24} strokeWidth={1} />
                            </button>
                        </Magnetic>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-20 pt-16 border-t border-gray-100">
                        <div className="flex items-center gap-6 mb-12">
                            <h3 className="font-fashion-serif text-3xl italic font-black text-black">Technical Details</h3>
                        </div>
                        <div className="max-w-3xl text-gray-500 font-medium text-sm leading-relaxed whitespace-pre-line tracking-wide">
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
            <div className={`fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 p-6 transition-transform duration-500 ease-in-out md:hidden ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Total</span>
                        <div className="text-lg font-fashion-sans font-light text-black">
                            {config.currency.symbol}{product.price.toLocaleString()}
                        </div>
                    </div>
                    <button
                        onClick={handleBuyNow}
                        disabled={isSoldOut}
                        className="flex-1 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] py-4 shadow-xl active:scale-95 disabled:opacity-50"
                    >
                        {isSoldOut ? 'Sold Out' : 'Buy Now'}
                    </button>
                    <button
                        onClick={openCart}
                        className="relative w-12 h-12 flex items-center justify-center border border-gray-100"
                    >
                        <ShoppingBag size={20} strokeWidth={1} className="text-black" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailClient;
