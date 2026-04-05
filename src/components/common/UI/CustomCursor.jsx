"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth the movement
    const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable =
                target.closest('button') ||
                target.closest('a') ||
                target.closest('select') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isClickable);
        };

        const handleMouseOut = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseOut);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
            style={{ x: x, y: y, translateX: '-50%', translateY: '-50%' }}
        >
            {/* Primary soft blur */}
            <motion.div
                animate={{
                    scale: isHovering ? 2 : 1,
                    opacity: isHovering ? 0.3 : 0.15
                }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-xl"
            />

            {/* Inner defined dot */}
            <motion.div
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.2)'
                }}
                className="absolute inset-[30%] border border-emerald-500/20 rounded-full"
            />
        </motion.div>
    );
};

export default CustomCursor;
