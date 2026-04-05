const ProductCardSkeleton = () => {
    return (
        <div className="bg-white border-b border-gray-50 pb-10 h-full flex flex-col">
            {/* Image Hologram */}
            <div className="w-full aspect-[3/4] bg-gray-50 mb-6 grayscale opacity-20" />

            {/* Content */}
            <div className="flex-1 flex flex-col space-y-4 px-2">
                <div className="h-3 bg-gray-50 w-1/4" /> {/* Category */}
                <div className="h-5 bg-gray-50 w-3/4" /> {/* Title */}
                <div className="h-4 bg-gray-50 w-1/3 mt-2" /> {/* Price */}
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
