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

// Lazy load Reviews later
// import Reviews from '../Reviews/Reviews';

const ProductDetailClient = ({ slug, initialProduct }) => {
    const router = useRouter();
    const { showToast } = useToast();

    // React Query Fetch with Server Data Hydration ⚡
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
                // Show after scrolling past the main buy buttons (~500px)
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
        // Use the backend "smart share" link to ensure OG images work
        const shareUrl = `${API_BASE_URL}/api/share/product/${product.id}`;
        const message = `Check out this product: ${product.title}\n\nPrice: Rs. ${product.price}\n\n${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        showToast('Opening WhatsApp...', 'info');
    };

    const handleAddToCart = () => {
        addToCart({ ...product, selectedOptions: { color: selectedColor } });
        showToast(`Added ${product.title} to Cart`, 'success');
    };

    const handleBuyNow = () => {
        if (!isInCart(product.id)) {
            addToCart({ ...product, selectedOptions: { color: selectedColor } });
        }
        setTimeout(() => openCart(), 200);
    };

    // Structured data for SEO (Client side mainly if not using metadata API fully yet, but useful for rich snippets)
    const IMAGE_FALLBACK = `${config.api.baseUrl}/og-image.jpg`;
    let imageUrl = product && product.image ? getImageUrl(product.image) : IMAGE_FALLBACK;

    if (imageUrl && !imageUrl.startsWith('http')) {
        if (imageUrl.startsWith('/')) {
            // Assume API base if starts with slash? Or config.api.baseUrl
            // getImageUrl usually returns full path if configured, or relative.
            // Let's force absolute for SEO
            imageUrl = `${config.api.baseUrl}${imageUrl}`;
        }
    }

    const categoryLabel = Array.isArray(product.category) ? product.category[0] : product.category;
    const categorySlug = encodeURIComponent((categoryLabel || '').toLowerCase().replace(/\s+/g, '-'));

    const breadcrumbItems = [
        { name: 'Home', to: '/' },
        { name: categoryLabel || 'Category', to: `/category/${categorySlug}` },
        { name: product.title, to: null } // Current page
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
            {/* Client-side SEO injection (Optional if server metadata is enough, but good for dynamic updates) */}
            <SEO
                title={`${product.title} | ${config.appName}`}
                description={`Buy ${product.title} - ${String(product.description || '').substring(0, 150)}...`}
                canonical={`${config.api.baseUrl}/product/${product.slug || product.id}`}
                image={imageUrl}
                type="product"
            />

            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors group"
                >
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100/50">
                {/* Product Image Gallery */}
                <div className="space-y-4">
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
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Thumbnail Preview (Visual enhancement even for single image) */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="w-20 h-20 rounded-xl border-2 border-emerald-500 p-1 shrink-0 bg-white">
                            <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-50">
                                <Image src={getImageUrl(product.image)} alt="Thumbnail" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="w-20 h-20 rounded-xl border-2 border-transparent p-1 shrink-0 bg-slate-50 hover:border-slate-200 transition-colors opacity-40 grayscale">
                            <div className="relative w-full h-full rounded-lg overflow-hidden">
                                <Image src={getImageUrl(product.image)} alt="Thumbnail" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 leading-tight">{product.title}</h1>
                    <div className="text-gray-500 mb-2 text-sm uppercase tracking-wide font-medium">
                        {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                    </div>
                    {product.material && product.material.toLowerCase() !== 'handmade' && (
                        <div className="text-gray-600 mb-4 text-sm bg-slate-50 inline-block px-2 py-1 rounded border border-slate-200">
                            Material: <span className="font-semibold">{product.material}</span>
                        </div>
                    )}

                    {/* Price with Discount */}
                    <div className="mb-6 mt-2">
                        {product.price > 0 ? (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-3xl font-extrabold text-emerald-700">
                                        {config.currency.symbol} {product.price.toLocaleString(config.currency.locale)}
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-200">
                                        20% OFF
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-gray-400 line-through decoration-slate-300">
                                        {config.currency.symbol} {Math.round(product.price / 0.8).toLocaleString(config.currency.locale)}
                                    </span>
                                    <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                                        You save {config.currency.symbol} {(Math.round(product.price / 0.8) - product.price).toLocaleString(config.currency.locale)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="text-xl text-gray-500 italic">Contact for price</div>
                        )}
                    </div>

                    {/* Trust panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Cash on Delivery
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            7-day Return
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Open-box Delivery
                        </div>
                    </div>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
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
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        {product.price === 0 ? (
                            <a
                                href={`https://www.instagram.com/${config.socials.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3.5 rounded-xl text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-pink-500/20 transition-all hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                Ask price on Insta
                            </a>
                        ) : (
                            <>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isSoldOut}
                                    className={`flex-1 px-6 py-3.5 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold transition-all active:scale-95 ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Add to Cart
                                </button>
                                {!isSoldOut && (
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 px-6 py-3.5 rounded-xl text-white bg-slate-900 hover:bg-slate-800 font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={handleWhatsAppShare}
                            className="px-4 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                            aria-label="Share on WhatsApp"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            Share
                        </button>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <h3 className="text-lg font-playfair font-bold mb-4 text-slate-900 border-l-4 border-emerald-500 pl-3">About The Product</h3>
                        <div className="prose prose-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Viewed */}
            <div className="mt-16">
                <RecentlyViewed />
            </div>

            {/* Related products (simple: same category) */}
            <RelatedProducts currentId={product.id} category={product.category} />

            {/* Reviews Section */}
            <div className="mt-12 border-t border-slate-100 pt-12 text-center">
                <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-2">Customer Reviews</h2>
                <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                </div>
                <p className="text-slate-500 font-medium italic">"Authentic reviews from verified buyers are coming soon!"</p>
            </div>

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
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">1</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailClient;
