"use client";

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        {/* Left: Desktop Image Gallery Skeleton */}
        <div className="lg:w-3/5 space-y-4">
          <div className="aspect-[4/5] w-full bg-slate-50 rounded-sm animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-50 rounded-sm animate-pulse" />
            ))}
          </div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div className="lg:w-2/5 flex flex-col pt-4">
          {/* Breadcrumb Skeleton */}
          <div className="h-3 w-32 bg-slate-50 rounded animate-pulse mb-8" />

          {/* Title & Price Skeleton */}
          <div className="space-y-4 mb-12">
            <div className="h-12 w-full bg-slate-100 rounded-sm animate-pulse" />
            <div className="h-12 w-1/2 bg-slate-100 rounded-sm animate-pulse" />
            <div className="h-6 w-24 bg-slate-50 rounded-sm animate-pulse mt-6" />
          </div>

          {/* Size Select Skeleton */}
          <div className="space-y-6 mb-12 py-10 border-y border-gray-100">
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 w-12 border border-gray-100 rounded-sm animate-pulse" />
              ))}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="space-y-4">
            <div className="h-16 w-full bg-slate-100 rounded-sm animate-pulse" />
            <div className="h-16 w-full border border-slate-100 rounded-sm animate-pulse" />
          </div>

          {/* Description Skeleton */}
          <div className="mt-16 space-y-4">
            <div className="h-3 w-2/3 bg-slate-50 rounded animate-pulse" />
            <div className="h-3 w-full bg-slate-50 rounded animate-pulse" />
            <div className="h-3 w-full bg-slate-50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
