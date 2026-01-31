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
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import useMagnetic from '../../hooks/useMagnetic';
import { triggerWishlistAnimation } from '../UI/FloatingHearts';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProductFn } from '../../hooks/useProductQuery';
import { useCart } from '../../context/CartContext';
import { triggerPremiumFeedback } from '../../utils/feedback';
import { useWishlist } from '../../context/WishlistContext';
import { useCartAnimation } from '../../context/CartAnimationContext';
import getImageUrl from '../../utils/imageUrl';
import config from '../../config';
import { NewBadge, SaleBadge, OutOfStockBadge } from '../UI/ProductBadges';
import { isNewProduct, isOnSale, getDiscountPercentage } from '../../utils/productUtils';

const ProductCard = (inputProps) => {
    const props = inputProps.product ? { ...inputProps.product, ...inputProps } : inputProps;

    const {
        id,
        title,
        price,
        image,
        slug,
        category = "",
        stock = 0.
    } = props;

    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const isWishlisted = isInWishlist(id);
    const isSoldOut = stock <= 0;

    const originalPrice = price && (props.salePrice || (props.originalPrice && props.originalPrice > price))
        ? (props.originalPrice || Math.round(price * 1.2))
        : null;

    const discountPercent = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(props);
    };

    return (
        <div className="group relative flex flex-col bg-white overflow-hidden">
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <Link href={`/product/${slug || id}`} className="block h-full w-full">
                    <Image
                        src={getImageUrl(image)}
                        alt={title}
                        fill
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImgLoaded(true)}
                    />
                </Link>

                {/* Badges */}
                {isSoldOut ? <OutOfStockBadge /> : (
                    <>
                        {isNewProduct(props.createdAt) && <NewBadge />}
                        {isOnSale(price, props.originalPrice) && (
                            <SaleBadge discount={getDiscountPercentage(price, props.originalPrice)} />
                        )}
                    </>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                >
                    <WishlistButton
                        isWishlisted={isWishlisted}
                        onToggle={handleWishlistToggle}
                        className="w-5 h-5"
                    />
                </button>

                {/* Quick View Button (Desktop) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
                    <button
                        onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
                        className="w-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] py-3 shadow-md hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        Quick View
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="pt-4 pb-6 px-1 text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1.5 font-bold">
                    {Array.isArray(category) ? category[0] : category}
                </div>
                <Link href={`/product/${slug || id}`}>
                    <h3 className="font-fashion-sans text-[13px] font-medium tracking-tight text-gray-900 group-hover:text-gray-500 transition-colors mb-2 line-clamp-1 uppercase">
                        {title}
                    </h3>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    <span className="text-sm font-bold text-black tracking-tight">
                        Rs. {Number(price).toLocaleString('en-PK')}
                    </span>
                    {originalPrice > price && (
                        <span className="text-xs text-gray-400 line-through font-medium">
                            Rs. {originalPrice.toLocaleString('en-PK')}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick View Modal */}
            <QuickViewModal
                product={props}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </div>
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
