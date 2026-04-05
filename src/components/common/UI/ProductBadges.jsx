import React from 'react';
import { motion } from 'framer-motion';

export const NewBadge = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm"
    >
        New In
    </motion.div>
);

export const SaleBadge = ({ discount }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm"
    >
        Sale {discount}%
    </motion.div>
);

export const OutOfStockBadge = () => (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
        <span className="px-3 py-1 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-200">
            Sold Out
        </span>
    </div>
);
