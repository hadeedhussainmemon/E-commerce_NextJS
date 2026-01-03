"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import WishlistButton from './WishlistButton';
// Lazy Load QuickViewModal
const QuickViewModal = dynamic(() => import('./QuickViewModal'), {
    loading: () => null, // No loader needed, it's a modal
    ssr: false // No need to SSR the modal
});
import { useQueryClient } from '@tanstack/react-query';
import { fetchProductFn } from '../../hooks/useProductQuery';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCartAnimation } from '../../context/CartAnimationContext';
import getImageUrl from '../../utils/imageUrl';
import config from '../../config';

const ProductCard = (inputProps) => {
    // Handle case where properties are wrapped in a 'product' prop (common in usage)
    const props = inputProps.product ? { ...inputProps.product, ...inputProps } : inputProps;


    const {
        id,
        title,
        price,
        description,
        image,
        slug,
        material = "",
        category = "Bracelet",
        stock = 0,
        isCustomizable = false,
        disableTitleLink = false,
        isTrending = false,
        priority = false // New prop for LCP optimization
    } = props;
    const { addToCart, isInCart, openCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { startAnimation } = useCartAnimation();

    const [imgLoaded, setImgLoaded] = useState(false);

    // Computed values
    const product = props;
    const isWishlisted = isInWishlist(id);
    const isSoldOut = stock <= 0;

    // Calculate discount
    const originalPrice = price && (props.salePrice || (props.originalPrice && props.originalPrice > price))
        ? (props.originalPrice || Math.round(price * 1.2))
        : null;

    const discountPercent = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    // State
    const [showModal, setShowModal] = useState(false);
    const [modalImageLoaded, setModalImageLoaded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        setIsAdding(true);
        addToCart(product);

        // Fly-to-cart Animation
        if (image) {
            try {
                // Find image in this card
                const card = e.currentTarget.closest('.bg-white'); // Matches the outer card div
                const img = card?.querySelector('img');

                if (img) {
                    const rect = img.getBoundingClientRect();
                    startAnimation(rect, getImageUrl(image));
                }
            } catch (err) {
                console.error("Animation error:", err);
            }
        }

        // Visual feedback
        setTimeout(() => {
            setIsAdding(false);
        }, 600);
    };

    const handleBuyNow = () => {
        if (!isInCart(id)) {
            addToCart(product);
        }
        // Small delay to show toast, then open cart
        setTimeout(() => {
            openCart();
        }, 300);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleWhatsAppShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Ensure ID exists before building URL
        if (!id) {
            alert('Unable to share: Product ID is missing');
            return;
        }

        const productUrl = `${window.location.origin}/product/${slug || id}`;
        const message = `Check out this product: ${title} - Rs. ${Number(price).toLocaleString('en-PK')}\n${productUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Prevent background scroll when modal open and handle Escape key
    React.useEffect(() => {
        if (showModal) {
            // Lock scroll
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            const onKey = (e) => {
                if (e.key === 'Escape') setShowModal(false);
            };
            window.addEventListener('keydown', onKey);
            return () => {
                document.body.style.overflow = prev;
                window.removeEventListener('keydown', onKey);
            };
        }
        return undefined;
    }, [showModal]);

    const openModal = (e) => {
        e.preventDefault();
        setModalImageLoaded(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Prefetch product data on hover
    const qc = useQueryClient();

    const handleMouseEnter = () => {
        if (id || slug) {
            const key = slug || id;
            qc.prefetchQuery({
                queryKey: ['product', String(key)],
                queryFn: fetchProductFn,
                staleTime: 5 * 60 * 1000 // Match hook staleTime
            });
        }
    };

    const [showQuickView, setShowQuickView] = useState(false);

    const openQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    return (
        <>
            <div
                className={`w-full bg-white border border-gray-100 rounded-xl hover:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${isSoldOut ? 'opacity-75' : ''}`}
                itemScope
                itemType="https://schema.org/Product"
            >
                {/* ... existing meta tags ... */}
                <div className="relative w-full">
                    <Link
                        href={`/product/${slug || id}`}
                        className="block overflow-hidden rounded-t-xl hover:rounded-t-2xl transition-all duration-300"
                        tabIndex={-1}
                        style={{ position: 'relative' }}
                        onMouseEnter={handleMouseEnter}
                    >
                        {/* Square aspect wrapper: centered image with padding */}
                        <div className="relative w-full aspect-square overflow-hidden rounded-t-xl bg-white flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" aria-hidden="true"></div>
                            {/* Image placeholder skeleton */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${imgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse"></div>
                            </div>

                            <Image
                                className={`relative object-contain transition-transform duration-300 hover:scale-105 drop-shadow-sm border border-slate-100 rounded-md ${imgLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
                                src={getImageUrl(image, { width: 400, height: 400, crop: 'pad' })}
                                alt={title}
                                onClick={openModal}
                                style={{ cursor: 'zoom-in' }}
                                loading={priority ? "eager" : "lazy"}
                                priority={priority}
                                width={300}
                                height={300}
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 300px"
                                onLoad={() => setImgLoaded(true)}
                                onError={(e) => {
                                    // Next.js Image component handles error fallback differently, usually via blurDataURL or state
                                }}
                            />

                            {/* Quick View Button (Desktop) */}
                            {!isSoldOut && (
                                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-center z-10 pointer-events-none">
                                    <button
                                        onClick={openQuickView}
                                        className="bg-white/90 backdrop-blur-md text-gray-900 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all pointer-events-auto transform translate-y-4 group-hover:translate-y-0 duration-300"
                                    >
                                        Quick View
                                    </button>
                                </div>
                            )}
                        </div>
                        {isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-t-xl z-20 pointer-events-none bg-black/10 backdrop-blur-[2px]">
                                <span className="bg-red-600 text-white text-xs sm:text-base font-bold px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg shadow-lg transform -rotate-12">
                                    SOLD OUT
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Top Right Badges */}
                    <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 flex flex-col gap-1.5 z-10">
                        {/* Show categories - if array show multiple, limit to 2 visible */}
                        {Array.isArray(category) ? (
                            category.slice(0, 2).map((cat, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full capitalize shadow-sm">
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className="bg-slate-100 text-slate-700 text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full capitalize shadow-sm">
                                {category}
                            </span>
                        )}
                        {isTrending && (
                            <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md animate-pulse flex items-center gap-0.5 sm:gap-1">
                                🔥 <span className="hidden sm:inline">Trending</span>
                            </span>
                        )}
                    </div>

                    {/* Top Left - Low Stock Badge */}
                    {!isSoldOut && stock > 0 && stock <= 5 && (
                        <span className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 bg-amber-100 text-amber-700 text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full z-10 animate-pulse shadow-sm">
                            Only {stock} left!
                        </span>
                    )}

                    {/* Action Buttons - Top Left (Wishlist & Share) */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-2 z-10" style={{ marginTop: stock > 0 && stock <= 5 && !isSoldOut ? '32px' : '0' }}>
                        {/* Wishlist Button */}
                        <WishlistButton
                            isWishlisted={isWishlisted}
                            onToggle={handleWishlistToggle}
                            className="w-8 h-8 sm:w-10 sm:h-10"
                        />

                        {/* WhatsApp Share Button */}
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 text-white"
                            aria-label="Share on WhatsApp"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Product Info - More compact and organized */}
                <div className="px-2 sm:px-3 w-full flex flex-col flex-grow pb-2 sm:pb-3">
                    {/* Title */}
                    {disableTitleLink ? (
                        <h2 className="text-sm sm:text-lg md:text-xl font-playfair font-semibold text-gray-900 text-center mt-1.5 sm:mt-2 mb-1 line-clamp-2 hover:text-emerald-600 transition-colors min-h-[40px] sm:min-h-[48px]" itemProp="name">
                            {title}
                        </h2>
                    ) : (
                        <Link href={`/product/${slug || id}`} itemProp="url">
                            <h2 className="text-sm sm:text-base md:text-lg font-playfair font-semibold text-gray-900 text-center mt-1.5 sm:mt-2 mb-1 line-clamp-2 hover:text-slate-700 transition-colors min-h-[36px] sm:min-h-[44px]" itemProp="name">
                                {title}
                            </h2>
                        </Link>
                    )}

                    {/* Customizable Badge */}
                    {isCustomizable && (
                        <div className="flex justify-center mb-1.5">
                            <span className="bg-slate-50 text-slate-600 text-[9px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                                ⚙️ Customizable
                            </span>
                        </div>
                    )}

                    {/* Price Section - More compact */}
                    <div className="text-center mb-1 sm:mb-2 min-h-[44px]">
                        {Number(price) > 0 ? (
                            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                                    <span className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
                                        Rs. {Number(price).toLocaleString('en-PK')}
                                    </span>
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
                                        {discountPercent}% OFF
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                                    {originalPrice > price && (
                                        <span className="text-xs sm:text-sm text-gray-400 line-through decoration-gray-400/50">
                                            {config.currency.symbol} {originalPrice.toLocaleString('en-PK')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs sm:text-sm text-gray-500">Contact for price</span>
                        )}
                    </div>

                    {/* Description - Hidden on mobile for compactness */}
                    <p className="hidden md:block text-gray-600 text-xs text-center mb-3 line-clamp-2" itemProp="description">
                        {description}
                    </p>

                    {/* Schema.org metadata */}
                    <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
                        <meta itemProp="price" content={price} />
                        <meta itemProp="priceCurrency" content="PKR" />
                        <link itemProp="availability" href={`https://schema.org/${stock > 0 ? 'InStock' : 'OutOfStock'}`} />
                    </div>

                    {/* Action Buttons - More compact on mobile */}
                    <div className="flex gap-1.5 sm:gap-2 mt-auto">
                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || price === 0 || isSoldOut}
                            className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold rounded-lg text-[10px] sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 transition-all duration-300 ${isAdding ? 'scale-95' : 'hover:scale-[1.02]'} ${(price === 0 || isSoldOut) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAdding ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="hidden sm:inline">Adding...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span>Add</span>
                                </>
                            )}
                        </button>

                        {/* Buy Now / Contact Button */}
                        {price > 0 ? (
                            <button
                                onClick={handleBuyNow}
                                disabled={isSoldOut}
                                className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-white bg-slate-900 hover:bg-black font-semibold rounded-lg text-[10px] sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                </svg>
                                <span>Buy</span>
                            </button>
                        ) : (
                            <a
                                href={`https://www.instagram.com/${config.socials.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => { if (isSoldOut) e.preventDefault(); }}
                                aria-disabled={isSoldOut}
                                className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold rounded-lg text-[10px] sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg ${isSoldOut ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0l-4-4m4 4l-4 4" />
                                </svg>
                                <span className="hidden md:inline">Message on Instagram</span>
                                <span className="md:hidden">Message</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={closeModal} role="dialog" aria-modal="true">
                        <div className="relative max-w-3xl w-full flex flex-col items-center transform transition-all duration-200 ease-out scale-95 opacity-0" onClick={e => e.stopPropagation()} style={{ animation: 'modalIn 180ms ease forwards' }}>
                            <button
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg z-10"
                                onClick={closeModal}
                                aria-label="Close image preview"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="w-full flex items-center justify-center p-4 min-h-[200px]">
                                {!modalImageLoaded && (
                                    <div className="flex items-center justify-center w-full h-64">
                                        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                    </div>
                                )}
                                <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
                                    <Image
                                        src={getImageUrl(image)}
                                        alt={title}
                                        fill
                                        className={`rounded-xl shadow-2xl border-4 border-white object-contain cursor-zoom-in transition-opacity duration-200 ${modalImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        style={{ background: '#fff' }}
                                        onClick={e => e.stopPropagation()}
                                        onLoad={() => setModalImageLoaded(true)}
                                        sizes="(max-width: 768px) 100vw, 80vw"
                                        quality={90}
                                    />
                                </div>
                            </div>
                            <div className="text-white text-lg font-semibold mt-2 text-center drop-shadow-lg">{title}</div>
                        </div>
                    </div>
                    <style>{`@keyframes modalIn { from { transform: scale(0.98); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
                </ModalPortal>
            )}

            {/* Quick View Modal */}
            <QuickViewModal
                product={product}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </>
    );
};

export default React.memo(ProductCard);

// Render modal in portal to avoid being affected by card styles
const ModalPortal = ({ children }) => {
    if (typeof document === 'undefined') return null;
    return createPortal(children, document.body);
};



// Attach portal rendering via side-effect
// Note: we render portal from within component when showModal is true — handled above inside component via conditional
