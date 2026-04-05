import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistButton = ({ isWishlisted, onToggle, className = "" }) => {
    return (
        <motion.button
            onClick={onToggle}
            className={`relative flex items-center justify-center rounded-full transition-shadow duration-300 shadow-lg hover:shadow-xl ${className} ${isWishlisted
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-500'
                }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <AnimatePresence mode="wait">
                {isWishlisted ? (
                    <motion.svg
                        key="filled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-5 h-5 drop-shadow-sm"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                    >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </motion.svg>
                ) : (
                    <motion.svg
                        key="outline"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </motion.svg>
                )}
            </AnimatePresence>

            {/* Particle Explosion Effect (CSS-based for lightweight performance, triggered by parent state change technically but simpler to keep concise here or add complex framer motion particles if needed. For now, the spring animation is the "pop") */}
        </motion.button>
    );
};

export default WishlistButton;
