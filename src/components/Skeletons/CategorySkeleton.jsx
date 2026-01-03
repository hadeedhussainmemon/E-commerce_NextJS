import React from 'react';
import Skeleton from '../UI/Skeleton';

export const CategoryHeroSkeleton = () => (
    <div className="relative bg-slate-900 overflow-hidden pb-16 pt-16 lg:pt-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="mb-8 flex justify-center">
                <Skeleton variant="rectangular" className="w-64 h-8 rounded-full bg-white/5" />
            </div>
            <Skeleton variant="rectangular" className="w-3/4 md:w-1/2 h-16 md:h-24 mx-auto mb-6 rounded-3xl bg-white/5" />
            <Skeleton variant="rectangular" className="w-full md:w-2/3 h-6 mx-auto mb-10 rounded-full bg-white/5" />

            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" className="w-24 h-10 rounded-xl bg-white/5" />
                ))}
            </div>
        </div>
    </div>
);

export const CategoryCardSkeleton = () => (
    <div className="aspect-[4/5] bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 flex flex-col justify-end relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 animate-pulse" />
        <div className="relative z-10 space-y-3">
            <Skeleton variant="text" width="60%" height="1.5rem" className="bg-slate-200/50" />
            <Skeleton variant="text" width="30%" height="1rem" className="bg-slate-200/50" />
        </div>
    </div>
);

const CategorySkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
            ))}
        </div>
    );
};

export default CategorySkeleton;
