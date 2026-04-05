"use client";

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header Skeleton */}
      <div className="max-w-xl mb-20 space-y-4">
        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse tracking-[0.5em]" />
        <div className="h-16 w-3/4 bg-slate-100 rounded-sm animate-pulse" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex gap-8 border-b border-gray-100 pb-8 mb-16">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-6">
            <div className="aspect-[3/4] bg-slate-50 rounded-sm animate-pulse" />
            <div className="space-y-3">
              <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-slate-50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
