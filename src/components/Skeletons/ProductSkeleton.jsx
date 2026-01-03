import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex gap-2 mb-6">
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
                <div className="h-4 w-4 bg-slate-200 rounded"></div>
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                {/* Image Skeleton */}
                <div className="aspect-square md:aspect-auto min-h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-6 py-4">
                    {/* Title & Meta */}
                    <div className="space-y-3">
                        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>

                    {/* Price with gradient feel */}
                    <div className="space-y-2">
                        <div className="h-10 bg-slate-200 rounded w-40"></div>
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="h-10 bg-slate-100 rounded"></div>
                        <div className="h-10 bg-slate-100 rounded"></div>
                        <div className="h-10 bg-slate-100 rounded"></div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <div className="h-12 flex-1 bg-slate-200 rounded-lg"></div>
                        <div className="h-12 flex-1 bg-slate-200 rounded-lg"></div>
                    </div>

                    <div className="h-12 w-32 bg-slate-200 rounded-lg"></div>

                    {/* Description lines */}
                    <div className="space-y-2 pt-6 border-t border-slate-100">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
