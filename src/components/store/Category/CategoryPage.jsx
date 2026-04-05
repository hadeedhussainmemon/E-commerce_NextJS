"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/store/ProductCard/ProductCard';
import ProductCardSkeleton from '@/components/common/Skeletons/ProductCardSkeleton';
import CategorySkeleton, { CategoryHeroSkeleton } from '@/components/common/Skeletons/CategorySkeleton';
import config from '@/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Magnetic from '@/components/common/UI/Magnetic';

// Helper for query key
const fetchProductsQuery = async ({ queryKey }) => {
  const [_, { category, sort, q, page, pageSize }] = queryKey;

  // Construct URL
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (q) params.append('q', q);
  if (sort) params.append('sort', sort);
  params.append('page', page);
  params.append('pageSize', pageSize || 24);

  const API_BASE_URL = config.api.baseUrl;
  const baseUrl = config.api.endpoints.products;

  const response = await fetch(`${API_BASE_URL}${baseUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

const ALIAS_SLUGS = [
  'girls-accessories',
  'boys-accessories',
  'womens-watches',
  'mens-watches',
  'couple-gifts',
  'friendship-bands',
  'kids-bracelets'
];
const toDisplayName = (slug) => String(slug || '').replace(/-/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

function CategoryPage({ initialProducts, initialTotal, initialCategory, slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params?.category || "All";
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [sortOption, setSortOption] = useState('featured');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activePromo, setActivePromo] = useState(0);

  // Pagination from URL or default to 1
  const pageParam = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Update URL when page changes
  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', currentPage);
      return next;
    });
  }, [currentPage, setSearchParams]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset page on sort or category change
  useEffect(() => {
    setCurrentPage(1);
    setQuery('');
    setDebouncedQuery('');
  }, [slug]);

  // --- React Query ---
  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData
  } = useQuery({
    queryKey: ['products', {
      category: slug === 'All' ? '' : slug,
      sort: sortOption,
      q: debouncedQuery,
      page: currentPage,
      pageSize: 24
    }],
    queryFn: fetchProductsQuery,
    placeholderData: keepPreviousData,
    initialData: currentPage === 1 && !debouncedQuery && sortOption === 'featured' ? { products: initialProducts, total: initialTotal } : undefined
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / 24);

  // Promos
  const promos = [
    "🚚 Free Shipping on Orders Over Rs. 4999",
    "✨ New Arrivals: Check out our latest collection!",
    "🎁 Buy 2 Get 5% Off - Limited Time Offer!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promos.length]);

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const el = document.getElementById('product-grid');
      if (el) {
        const offset = 100; // slightly more for category header
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const displayName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const breadcrumbItems = [
    { name: 'Home', to: '/' },
    { name: displayName, to: `/category/${slug}` }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <CategoryHeroSkeleton />
        <div className="container mx-auto px-4 mt-12">
          <CategorySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Modern Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden pb-16 pt-16 lg:pt-32">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${config.api.baseUrl}/` },
                { '@type': 'ListItem', position: 2, name: 'Categories', item: `${config.api.baseUrl}/categories` }
              ]
            })
          }} />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-slate-500/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-slate-500/10 rounded-full blur-[100px]" 
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activePromo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-semibold text-slate-200"
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]"></span>
                {promos[activePromo]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-9xl font-fashion-serif italic font-black mb-6 tracking-tighter leading-tight capitalize text-white"
          >
            {displayName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            Discover our curated collection of {displayName}, selected for quality and craftsmanship.
          </motion.p>

          {/* Sub-Category Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto"
          >
            {ALIAS_SLUGS.map((slugKey) => (
              <Magnetic key={slugKey}>
                <Link
                  href={`/category/${slugKey}`}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm"
                >
                  {toDisplayName(slugKey)}
                </Link>
              </Magnetic>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Glass Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 md:p-4 flex flex-col md:flex-row gap-4 items-center justify-between ring-1 ring-black/5">
          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="search"
              placeholder={`Search ${displayName}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                aria-label="Sort products"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-gray-700 cursor-pointer transition-all"
              >
                <option value="featured">✨ Featured Pieces</option>
                <option value="priceAsc">💰 Price: Low to High</option>
                <option value="priceDesc">💎 Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 lg:mt-12">
        <div id="product-grid" className="scroll-mt-32"></div>

        {isError ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-500 mb-6">{error?.message || 'Failed to load products'}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-black text-white rounded-lg">Try Again</button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn't find any products in this category matching your criteria.</p>
            <Magnetic>
              <button 
                onClick={() => { setQuery(''); setSortOption('featured'); }} 
                className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl"
              >
                Clear Filters
              </button>
            </Magnetic>
          </div>
        ) : (
          <>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {products.map((product, i) => (
                <motion.div 
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="h-full"
                >
                  <ProductCard product={product} priority={i < 4} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPlaceholderData}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  Previous
                </button>
                <span className="text-gray-600 font-medium px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPlaceholderData}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


export default CategoryPage;
