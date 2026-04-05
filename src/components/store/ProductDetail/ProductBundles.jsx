"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import config from '../../config';
import { useCart } from '../../context/CartContext';
import getImageUrl from '../../utils/imageUrl';

const ProductBundles = ({ currentProduct }) => {
    const { addToCart, openCart } = useCart();

    // Fetch related products to form a bundle
    const { data: relatedProducts } = useQuery({
        queryKey: ['related-products', currentProduct.category],
        queryFn: async () => {
            // Fetch products from same category
            const cat = Array.isArray(currentProduct.category) ? currentProduct.category[0] : currentProduct.category;
            if (!cat) return [];
            const res = await fetch(`${config.api.baseUrl}${config.api.endpoints.products}?category=${encodeURIComponent(cat)}&limit=4`);
            const data = await res.json();
            return Array.isArray(data.products) ? data.products : [];
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!currentProduct.category
    });

    // Pick the first available product that isn't the current one
    const bundleItem = useMemo(() => {
        if (!relatedProducts) return null;
        return relatedProducts.find(p => p.id !== currentProduct.id && p.stock > 0);
    }, [relatedProducts, currentProduct.id]);

    if (!bundleItem) return null;

    const totalPrice = Number(currentProduct.price) + Number(bundleItem.price);
    const bundlePrice = Math.round(totalPrice * 0.9); // 10% Bundle Discount
    const savedAmount = totalPrice - bundlePrice;

    const handleAddBundle = () => {
        // Add both to cart
        addToCart(currentProduct);
        addToCart(bundleItem);
        // Maybe show toast saying "Bundle discount applied!" (Calculation usually happens in cart, but here we just push items)
        // For a real app, you'd pass a "bundleId" or discount code, but for this template, we just prompt the user.
        setTimeout(() => openCart(), 500);
    };

    return (
        <div className="mt-12 py-12 border-t border-b border-gray-100">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-10 text-center">
                Frequently Bought Together
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
                {/* Images with Plus Icon */}
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-40 bg-gray-50 rounded-sm overflow-hidden">
                        <Image src={getImageUrl(currentProduct.image)} alt={currentProduct.title} fill className="object-cover" />
                    </div>
                    <div className="text-gray-300 font-light text-3xl">+</div>
                    <div className="relative w-32 h-40 bg-gray-50 rounded-sm overflow-hidden">
                        <Image src={getImageUrl(bundleItem.image)} alt={bundleItem.title} fill className="object-cover" />
                    </div>
                </div>

                {/* Info & Action */}
                <div className="max-w-sm text-center lg:text-left space-y-6">
                    <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                        Combine <span className="text-black font-bold">{currentProduct.title}</span> with <Link href={`/product/${bundleItem.slug || bundleItem.id}`} className="text-black font-bold border-b border-black hover:opacity-70 transition-opacity">{bundleItem.title}</Link> and elevate your style.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-baseline justify-center lg:justify-start gap-3">
                            <span className="text-xl font-bold text-black">{config.currency.symbol}{bundlePrice.toLocaleString('en-PK')}</span>
                            <span className="text-sm text-gray-300 line-through">{config.currency.symbol}{totalPrice.toLocaleString('en-PK')}</span>
                            <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 uppercase tracking-wider">
                                Save {config.currency.symbol}{savedAmount.toLocaleString('en-PK')}
                            </span>
                        </div>

                        <button
                            onClick={handleAddBundle}
                            className="w-full lg:w-max px-10 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors active:scale-[0.98]"
                        >
                            Add Bundle To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductBundles;
