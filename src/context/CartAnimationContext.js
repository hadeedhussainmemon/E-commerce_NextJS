"use client";
import React, { createContext, useContext, useState, useRef } from 'react';

const CartAnimationContext = createContext();

export const useCartAnimation = () => useContext(CartAnimationContext);

export const CartAnimationProvider = ({ children }) => {
    const [animations, setAnimations] = useState([]);
    const cartIconRef = useRef(null);

    const startAnimation = (startRect, imageSrc) => {
        if (!cartIconRef.current) return;

        const endRect = cartIconRef.current.getBoundingClientRect();
        const id = Date.now();

        setAnimations(prev => [...prev, { id, startRect, endRect, imageSrc }]);

        // Auto cleanup after animation duration (e.g. 800ms)
        setTimeout(() => {
            setAnimations(prev => prev.filter(anim => anim.id !== id));
        }, 800);
    };

    return (
        <CartAnimationContext.Provider value={{ animations, startAnimation, cartIconRef }}>
            {children}
        </CartAnimationContext.Provider>
    );
};
