"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import config from '@/config';
import { Store, Watch, Smartphone, Glasses, Gift, Shirt, Sparkles, ChevronRight } from 'lucide-react';

function CategoryGrid({ categoriesFromSSR = null }) {
  const [categories, setCategories] = useState(categoriesFromSSR?.categories || []);
  const [loading, setLoading] = useState(!categoriesFromSSR);
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef(null);

  const API_BASE_URL = config.api.baseUrl;

  useEffect(() => {
    if (categoriesFromSSR && categoriesFromSSR.categories?.length > 0) {
      setCategories(categoriesFromSSR.categories);
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const base = (API_BASE_URL || '').replace(/\/$/, '');
        const url = base ? `${base}/api/products/categories` : `/api/products/categories`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setCategories(data.categories || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setLoading(false);
      }
    };
    fetchCategories();
  }, [API_BASE_URL, categoriesFromSSR]);

  const CategoryIcon = ({ name }) => {
    const lc = String(name || '').toLowerCase();
    const props = { size: 24, strokeWidth: 1.5, className: "text-black" };

    if (lc.includes('watch')) return <Watch {...props} />;
    if (lc.includes('phone') || lc.includes('tech')) return <Smartphone {...props} />;
    if (lc.includes('bag') || lc.includes('accessory')) return <Store {...props} />;
    if (lc.includes('glass')) return <Glasses {...props} />;
    if (lc.includes('gift')) return <Gift {...props} />;
    if (lc.includes('clothing') || lc.includes('active')) return <Shirt {...props} />;
    return <Sparkles {...props} />;
  };

  const toSlug = (name) => encodeURIComponent(String(name).trim().toLowerCase().replace(/\s+/g, '-'));

  const VISIBLE_COUNT = 8;
  const visibleCategories = showAll ? categories : categories.slice(0, VISIBLE_COUNT);

  if (loading) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-md">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Collections</span>
            <h2 className="font-fashion-serif text-4xl md:text-5xl italic font-black text-black tracking-tighter leading-tight">
              Shop By Category
            </h2>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:opacity-50 transition-opacity"
          >
            {showAll ? 'Show Fewer' : `View All (${categories.length})`}
          </button>
        </div>

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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
          {visibleCategories.map((category, idx) => (
            <Link
              key={`${category.name}-${idx}`}
              href={`/category/${toSlug(category.name)}`}
              className="group bg-white p-12 py-20 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-all duration-700 relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-10 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 shimmer-overlay">
                <CategoryIcon name={category.name} />
              </div>
              <h3 className="font-fashion-sans text-[12px] font-black uppercase tracking-[0.4em] text-black mb-3">
                {category.name}
              </h3>
              {typeof category.count === 'number' && (
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] italic font-fashion-serif">{category.count} Pieces</span>
              )}
              <motion.div 
                className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
              >
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-black">
                  Explore <ChevronRight size={14} className="text-black" />
                </div>
              </motion.div>
              
              {/* Subtle Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50/50 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
