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
                    opacity: isHovering ? 0.8 : 0.4,
                }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-xl"
            />

            {/* Outer Ring */}
            <motion.div
                animate={{
                    scale: isHovering ? 1.5 : 0,
                    opacity: isHovering ? 0.2 : 0,
                }}
                className="absolute inset-[-20%] border border-emerald-400 rounded-full blur-[2px]"
            />

            {/* Matrix Data Points (Abstract) */}
            {isHovering && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="absolute top-full left-full mt-2 ml-2 text-[8px] font-mono text-emerald-400 whitespace-nowrap uppercase tracking-tighter"
                >
                    Target Lock_
                </motion.div>
            )}
        </motion.div>
    );
};

export default NeuralCursor;
