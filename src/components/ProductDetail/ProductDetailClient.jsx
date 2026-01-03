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

// Lazy load Reviews later
// import Reviews from '../Reviews/Reviews';

const ProductDetailClient = ({ slug, initialProduct }) => {
    const router = useRouter();

    // React Query Fetch with Server Data Hydration ⚡
    const { data: product, isLoading: loading, error: queryError } = useProductQuery(slug, initialProduct);
    const error = queryError ? queryError.message : null;

    // Cart Context
    const { addToCart, isInCart, openCart } = useCart();

    // Local State
    const [selectedColor, setSelectedColor] = useState(null);

    // Track product view using the hook
    useTrackProductView(product?.id, product);

    // Initialize selected color when product loads
    useEffect(() => {
        if (product?.colors?.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    const API_BASE_URL = config.api.baseUrl;

    if (loading) return <div className="p-10 text-center">Loading product...</div>; // Replace with Skeleton later
    if (error) return <div className="max-w-5xl mx-auto p-6 text-red-600">{error}</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    const isSoldOut = product.stock === 0;

    const handleWhatsAppShare = () => {
        // Use the backend "smart share" link to ensure OG images work
        const shareUrl = `${API_BASE_URL}/api/share/product/${product.id}`;
        const message = `Check out this product: ${product.title}\n\nPrice: Rs. ${product.price}\n\n${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow">
                {/* Product Image */}
                <div className="relative aspect-square md:aspect-auto">
                    {isSoldOut && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                            Sold Out
                        </div>
                    )}
                    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
                        <Image
                            src={getImageUrl(product.image)}
                            alt={product.title}
                            fill
                            className="rounded-lg object-contain"
                            onError={(e) => { }} // Next.js handles this differently, maybe use state for fallback
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                    <div className="text-gray-600 mb-1">
                        Category: {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                    </div>
                    {product.material && product.material.toLowerCase() !== 'handmade' && (
                        <div className="text-gray-600 mb-3">Material: {product.material}</div>
                    )}

                    {/* Price with Discount */}
                    <div className="mb-4">
                        {product.price > 0 ? (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-3xl font-extrabold text-emerald-700">
                                        {config.currency.symbol} {product.price.toLocaleString(config.currency.locale)}
                                    </div>
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                        20% OFF
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-gray-400 line-through">
                                        {config.currency.symbol} {Math.round(product.price / 0.8).toLocaleString(config.currency.locale)}
                                    </span>
                                    <span className="text-sm text-green-600 font-semibold">
                                        Save {config.currency.symbol} {(Math.round(product.price / 0.8) - product.price).toLocaleString(config.currency.locale)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="text-xl text-gray-500">Contact for price</div>
                        )}
                    </div>

                    {/* Trust panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-sm">
                        {/* Icons would go here */}
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">Cash on Delivery</div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">7-day Return</div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">Open-box Delivery</div>
                    </div>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                            <div className="text-sm text-gray-700 mb-2">Choose color:</div>
                            <div className="flex items-center gap-2">
                                {product.colors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? 'ring-2 ring-offset-1 ring-purple-400' : ''}`}
                                        style={{ background: c }}
                                        aria-label={`Select color ${c}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        {product.price === 0 ? (
                            <a
                                href={`https://www.instagram.com/${config.socials.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-lg text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex items-center justify-center gap-2"
                            >
                                Ask price on Insta
                            </a>
                        ) : (
                            <>
                                <button
                                    onClick={() => addToCart({ ...product, selectedOptions: { color: selectedColor } })}
                                    disabled={isSoldOut}
                                    className={`px-5 py-3 rounded-lg border text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Add to Cart
                                </button>
                                {!isSoldOut && (
                                    <button
                                        onClick={handleBuyNow}
                                        className="px-5 py-3 rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={handleWhatsAppShare}
                            className="px-5 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                        >
                            Share
                        </button>
                    </div>

                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-playfair font-bold mb-3 text-gray-900">Product Details</h3>
                        <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                            {product.description}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related products (simple: same category) */}
            <RelatedProducts currentId={product.id} category={product.category} />

            {/* Reviews Section */}
            <div className="mt-12 border-t pt-8">
                {/* <Reviews /> */}
                <p className="text-center text-gray-500">Reviews loading...</p>
            </div>
        </div>
    );
};

export default ProductDetailClient;
