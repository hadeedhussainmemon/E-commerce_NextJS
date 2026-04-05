"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartAnimation } from '@/context/CartAnimationContext';

const FlyToCartAnimation = () => {
    const { animations } = useCartAnimation();

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {animations.map(anim => (
                    <motion.img
                        key={anim.id}
                        src={anim.imageSrc}
                        initial={{
                            position: 'absolute',
                            top: anim.startRect.top,
                            left: anim.startRect.left,
                            width: anim.startRect.width,
                            height: anim.startRect.height,
                            opacity: 1,
                            scale: 1,
                        }}
                        animate={{
                            top: anim.endRect.top + 10, // Adjust to center of icon
                            left: anim.endRect.left + 10,
                            width: 20,
                            height: 20,
                            opacity: 0.5,
                            scale: 0.2,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.32, 0.72, 0.35, 1.02] // Custom cubic bezier
                        }}
                        className="rounded-lg object-cover shadow-xl border border-white"
                        style={{ zIndex: 9999 }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FlyToCartAnimation;
