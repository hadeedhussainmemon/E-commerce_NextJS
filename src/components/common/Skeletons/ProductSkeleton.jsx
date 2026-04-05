const ProductSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 pb-24 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex gap-4 mb-12">
                <div className="h-3 w-16 bg-gray-50"></div>
                <div className="h-3 w-24 bg-gray-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Image Skeleton */}
                <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-10 py-4">
                    {/* Title & Meta */}
                    <div className="space-y-6">
                        <div className="h-4 bg-gray-50 w-1/4"></div>
                        <div className="h-12 bg-gray-50 w-full italic"></div>
                        <div className="h-6 bg-gray-50 w-1/3"></div>
                    </div>

                    <div className="h-24 bg-gray-50/50 w-full mb-10"></div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-12 bg-gray-50 border border-gray-100"></div>
                        <div className="h-12 bg-gray-50 border border-gray-100"></div>
                        <div className="h-12 bg-gray-50 border border-gray-100"></div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-4 pt-10 border-t border-gray-100">
                        <div className="h-14 w-full bg-gray-100"></div>
                        <div className="h-12 w-full bg-gray-50"></div>
                    </div>

                    {/* Description lines */}
                    <div className="space-y-4 pt-10 border-t border-gray-100">
                        <div className="h-3 bg-gray-50 w-full"></div>
                        <div className="h-3 bg-gray-50 w-full"></div>
                        <div className="h-3 bg-gray-50 w-4/5"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
