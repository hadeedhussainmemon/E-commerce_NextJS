"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const NeuralCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const cursorRef = useRef(null);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smoothing settings for a "liquid" feel
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Check if hovering over interactive element
            const target = e.target;
            const interactive = target.closest('button, a, input, select, textarea, [role="button"]');
            setIsHovering(!!interactive);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible, mouseX, mouseY]);

    // Hide on touch devices
    useEffect(() => {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) setIsVisible(false);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            ref={cursorRef}
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-screen overflow-visible"
            style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            {/* Core Glow */}
            <motion.div
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.6 : 0.3,
                }}
                className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] rounded-full blur-lg"
            />

            {/* Inner Ring */}
            <motion.div
                animate={{
                    scale: isHovering ? 0.8 : 0.4,
                    opacity: isHovering ? 1 : 0.8,
                }}
                className="absolute inset-0 border border-white/80 rounded-full"
            />

            {/* Outer Ring */}
            <motion.div
                animate={{
                    scale: isHovering ? 1.8 : 1.2,
                    opacity: isHovering ? 0.3 : 0.1,
                }}
                className="absolute inset-[-40%] border border-white/30 rounded-full blur-[1px]"
            />

            {/* Elegant Data Points */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 10 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-1/2 left-full -translate-y-1/2 ml-4 flex flex-col gap-1 items-start pointer-events-none"
                    >
                        <span className="text-[9px] font-medium tracking-[0.2em] text-white/90 drop-shadow-sm uppercase">Curated</span>
                        <div className="h-px w-8 bg-white/40" />
                        <span className="text-[7px] font-bold tracking-[0.3em] text-white/60 uppercase">Elite Selection</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default NeuralCursor;
