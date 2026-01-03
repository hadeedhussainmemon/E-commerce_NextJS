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
        <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🎁</span> Frequently Bought Together
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                {/* Images */}
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white shadow-sm">
                        <Image src={getImageUrl(currentProduct.image)} alt={currentProduct.title} fill className="object-cover" />
                    </div>
                    <div className="text-gray-400 font-bold text-xl">+</div>
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white shadow-sm">
                        <Image src={getImageUrl(bundleItem.image)} alt={bundleItem.title} fill className="object-cover" />
                    </div>
                </div>

                {/* Info & Action */}
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-gray-900">{currentProduct.title}</span>
                        <span className="mx-1">&</span>
                        <Link href={`/product/${bundleItem.slug || bundleItem.id}`} className="font-medium text-emerald-600 hover:underline">
                            {bundleItem.title}
                        </Link>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">{config.currency.symbol} {bundlePrice.toLocaleString('en-PK')}</span>
                                <span className="text-sm text-gray-400 line-through">{config.currency.symbol} {totalPrice.toLocaleString('en-PK')}</span>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Save {config.currency.symbol} {savedAmount.toLocaleString('en-PK')} (10%)
                            </span>
                        </div>

                        <button
                            onClick={handleAddBundle}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-black transition-all active:scale-95 shadow-lg hover:shadow-xl w-full sm:w-auto"
                        >
                            Add Bundle to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductBundles;
