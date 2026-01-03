import React from 'react';
import { motion } from 'framer-motion';

export const NewBadge = () => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-3 left-3 z-10 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg"
    >
        New
    </motion.div>
);

export const SaleBadge = ({ discount }) => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg"
    >
        -{discount}%
    </motion.div>
);

export const OutOfStockBadge = () => (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
        <span className="px-4 py-2 bg-slate-800 text-white text-sm font-black uppercase tracking-wider rounded-xl border border-slate-700">
            Out of Stock
        </span>
    </div>
);
