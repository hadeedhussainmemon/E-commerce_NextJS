"use client";

import { useEffect, useState } from 'react';

const MAX_RECENT_PRODUCTS = 10;
const STORAGE_KEY = 'recentlyViewedProducts';

export const useRecentlyViewed = () => {
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentProducts(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse recently viewed products', e);
            }
        }
    }, []);

    const addRecentProduct = (product) => {
        if (!product || !product.id) return;

        setRecentProducts((prev) => {
            // Remove if already exists
            const filtered = prev.filter((p) => p.id !== product.id);
            // Add to front
            const updated = [product, ...filtered].slice(0, MAX_RECENT_PRODUCTS);
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const clearRecentProducts = () => {
        setRecentProducts([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        recentProducts,
        addRecentProduct,
        clearRecentProducts,
    };
};
