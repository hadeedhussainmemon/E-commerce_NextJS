"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Trigger on route changes
    useEffect(() => {
        setIsAnimating(true);
        setProgress(30);

        const timer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setIsAnimating(false);
                setProgress(0);
            }, 400);
        }, 300);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return (
        <AnimatePresence>
            {isAnimating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1"
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{
                            width: { duration: 0.5, ease: "easeOut" },
                            opacity: { duration: 0.2 }
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
