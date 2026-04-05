"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import getImageUrl from '@/utils/imageUrl';
import config from '@/config';
import { getTrendingCategoriesFromSearches } from '@/hooks/useRecentSearches';
import { CategoryCardSkeleton } from '@/components/common/Skeletons/CategorySkeleton';

const PageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="h-16 w-3/4 md:w-1/2 bg-slate-100 rounded-2xl mx-auto mb-6 animate-pulse"></div>
      <div className="h-2 w-24 bg-emerald-100 rounded-full mx-auto mb-8 animate-pulse"></div>
      <div className="h-6 w-96 bg-slate-50 rounded-full mx-auto mb-16 animate-pulse"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const navigate = (path) => router.push(path);

  const API_BASE_URL = useMemo(() => (config.api.baseUrl || '').replace(/\/$/, ''), []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use the dedicated categories endpoint
        const response = await fetch(`${API_BASE_URL}/api/products/categories`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} `);
        }

        const data = await response.json();

        // Backend returns { categories: [...] }
        const categoriesData = data.categories || [];

        if (!categoriesData || categoriesData.length === 0) {
          console.warn('No categories returned from API');
          setCategories([]);
          setLoading(false);
          return;
        }

        // Categories come with name, count, and image already
        // Move trending categories to top using recent searches and API counts
        try {
          const trending = getTrendingCategoriesFromSearches(categoriesData, 6);
          if (Array.isArray(trending) && trending.length) {
            // Create a map for quick lookups
            const map = categoriesData.reduce((m, c) => { m[c.name] = c; return m; }, {});
            const ordered = [];
            trending.forEach(t => { if (map[t]) { ordered.push(map[t]); delete map[t]; } });
            // Append remaining categories
            Object.keys(map).forEach(k => ordered.push(map[k]));
            setCategories(ordered);
          } else {
            setCategories(categoriesData);
          }
        } catch (e) {
          setCategories(categoriesData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set empty array on error so component still renders
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  // Trending category names derived from recent searches and API categories
  const trendingNames = useMemo(() => getTrendingCategoriesFromSearches(categories, 6), [categories]);

  // No client-side alias counts; backend returns categories with counts

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  // ...

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-6 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-6xl font-display font-black text-slate-900 mb-4 uppercase tracking-tight">
            Shop by <span className="text-emerald-600">Category</span>
          </h1>
          <div className="w-24 h-2 bg-emerald-600 mx-auto rounded-full mb-6 shadow-lg shadow-emerald-200"></div>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explore our curated collections and discover items that speak to your style.
          </p>
        </div>
        {trendingNames && trendingNames.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Trending categories</h3>
            <div className="flex flex-wrap gap-2">
              {trendingNames.map((name) => (
                <Link key={name} href={`/category/${encodeURIComponent(String(name).trim().toLowerCase().replace(/\s+/g, '-'))}`} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-black text-emerald-700 hover:bg-emerald-100 transition-all uppercase tracking-wider">
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid - 2-Col on Mobile, optimized density */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${encodeURIComponent(String(category.name).trim().toLowerCase().replace(/\s+/g, '-'))}`}
              className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Category Image - Square / Slightly taller on mobile */}
              <div className="aspect-[4/5] md:aspect-[4/3] overflow-hidden bg-slate-100 relative">
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Gradient Overlay - darker at bottom for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              </div>

              {/* Category Info */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2">
                  <h3 className="text-sm md:text-xl lg:text-2xl font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors capitalize drop-shadow-lg line-clamp-1">
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-0.5 md:mt-0">
                  <p className="text-gray-300 text-[10px] md:text-sm font-medium drop-shadow">
                    {category.count} {category.count === 1 ? 'Item' : 'Items'}
                  </p>
                </div>

                {/* View Products Button - Appears on Hover (Desktop only mainly) */}
                <div className="hidden md:block mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-lg border border-white/30">
                    View
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
          <button
            onClick={handleBackClick}
            type="button"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-600 text-base font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/20 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
