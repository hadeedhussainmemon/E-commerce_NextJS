"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Heart = ({ x, y, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x, y }}
            animate={{
                opacity: [0, 1, 0.8, 0],
                scale: [0, 1.2, 1, 0.8],
                x: x + (Math.random() - 0.5) * 200,
                y: y - 100 - Math.random() * 200
            }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            className="absolute pointer-events-none z-[9999] text-rose-500"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </motion.div>
    );
};

const FloatingHearts = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const handleWishlistEvent = (e) => {
            const { x, y } = e.detail;
            const newHearts = Array.from({ length: 6 }).map((_, i) => ({
                id: Date.now() + i,
                x,
                y,
                delay: i * 0.1
            }));
            setHearts(prev => [...prev, ...newHearts]);
        };

        window.addEventListener('wishlist-add', handleWishlistEvent);
        return () => window.removeEventListener('wishlist-add', handleWishlistEvent);
    }, []);

    useEffect(() => {
        if (hearts.length > 0) {
            const timer = setTimeout(() => {
                setHearts(prev => prev.slice(6));
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [hearts]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {hearts.map(heart => (
                    <Heart key={heart.id} x={heart.x} y={heart.y} delay={heart.delay} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FloatingHearts;

// Helper to trigger the animation
export const triggerWishlistAnimation = (x, y) => {
    window.dispatchEvent(new CustomEvent('wishlist-add', { detail: { x, y } }));
};
