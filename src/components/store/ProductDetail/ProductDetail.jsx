"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useProductQuery } from '../../hooks/useProductQuery';
import { useCartAnimation } from '../../context/CartAnimationContext';
import useTrackProductView from '../../hooks/useTrackProductView';
import getImageUrl from '../../utils/imageUrl';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import ProductCard from '../ProductCard/ProductCard';
import Reviews from '../Reviews/Reviews';
import { ArrowLeft, Check, Truck, ShieldCheck, Share2, ShoppingBag } from 'lucide-react';

import ProductDetailSkeleton from '../Skeletons/ProductDetailSkeleton';
import ProductBundles from './ProductBundles';
import config from '../../config';

const ProductDetail = () => {
  const params = useParams();
  const idOrSlug = params?.slug || params?.id;
  const router = useRouter();

  const { data: product, isLoading: loading, error: queryError } = useProductQuery(idOrSlug);
  const error = queryError ? queryError.message : null;
  const { addToCart, isInCart, openCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(null);

  useTrackProductView(product?.id, product);

  useEffect(() => {
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const API_BASE_URL = useMemo(() => (process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.__APP_CONFIG__?.API_BASE_URL : '') || '').replace(/\/$/, ''), []);

  if (loading) return <ProductDetailSkeleton />;
  if (error) return <div className="max-w-5xl mx-auto p-6 text-rose-600 text-center py-20 bg-rose-50 rounded-xl my-8">{error}</div>;
  if (!product) return null;

  const isSoldOut = product.stock === 0;

  const handleWhatsAppShare = () => {
    const shareUrl = `${API_BASE_URL}/api/share/product/${product.id}`;
    const message = `Check out this product: ${product.title}\n\nPrice: Rs. ${product.price}\n\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleBuyNow = () => {
    if (!isInCart(product.id)) {
      addToCart({ ...product, selectedOptions: { color: selectedColor } });
    }
    setTimeout(() => openCart(), 200);
  };

  const { startAnimation } = useCartAnimation();

  const handleAddToCartWithAnimation = (e) => {
    addToCart({ ...product, selectedOptions: { color: selectedColor } });
    const img = document.querySelector('.aspect-square img') || document.querySelector('img');
    if (img && product.image) {
      startAnimation(img.getBoundingClientRect(), getImageUrl(product.image));
    }
  };

  const IMAGE_FALLBACK = '/og-image.jpg';
  let imageUrl = product && product.image ? getImageUrl(product.image) : IMAGE_FALLBACK;

  if (imageUrl && !imageUrl.startsWith('http')) {
    if (imageUrl.startsWith('/') && typeof window !== 'undefined') {
      imageUrl = `${window.location.origin}${imageUrl}`;
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    category: Array.isArray(product.category) ? product.category.join(', ') : product.category,
    image: [imageUrl],
    brand: { '@type': 'Brand', name: config.appName },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.price,
      availability: isSoldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${config.api.baseUrl}/product/${product.slug || product.id}`,
    }
  };

  const categoryLabel = Array.isArray(product.category) ? product.category[0] : product.category;
  const categorySlug = encodeURIComponent((categoryLabel || '').toLowerCase().replace(/\s+/g, '-'));

  const breadcrumbItems = [
    { name: 'Home', to: '/' },
    { name: categoryLabel || 'Category', to: `/category/${categorySlug}` },
    { name: product.title, to: null }
  ];

  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />


      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
              {isSoldOut && (
                <div className="absolute top-6 left-6 bg-black text-white px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] z-10">
                  Sold Out
                </div>
              )}
              <Image
                src={getImageUrl(product.image)}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Gallery Thumbs - Placeholder for now if needed */}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col pt-4">
            <div className="mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">
                {categoryLabel}
              </span>
              <h1 className="font-fashion-serif text-4xl md:text-5xl italic font-black text-black tracking-tighter mb-6 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4">
                {product.price > 0 ? (
                  <div className="flex items-baseline gap-4">
                    <span className="text-2xl font-bold text-black font-fashion-sans">
                      {config.currency.symbol} {product.price.toLocaleString('en-PK')}
                    </span>
                    <span className="text-lg text-gray-300 line-through">
                      {config.currency.symbol} {Math.round(product.price * 1.2).toLocaleString('en-PK')}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-400">Price on Request</span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-10">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-4">Color</div>
                <div className="flex items-center gap-4">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border transition-all ${selectedColor === c
                        ? 'border-black ring-1 ring-black ring-offset-4'
                        : 'border-gray-200 hover:border-black'
                        }`}
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-12">
              {product.price > 0 && !isSoldOut ? (
                <>
                  <button
                    onClick={handleAddToCartWithAnimation}
                    className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors active:scale-[0.99]"
                  >
                    Add To Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-5 border border-black text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all active:scale-[0.99]"
                  >
                    Buy It Now
                  </button>
                </>
              ) : (
                <button disabled className="w-full py-5 bg-gray-100 text-gray-400 text-[11px] font-bold uppercase tracking-[0.3em] cursor-not-allowed">
                  {isSoldOut ? 'Sold Out' : 'Unavailable'}
                </button>
              )}
            </div>

            {/* Product description (mini) */}
            <div className="border-t border-gray-100 pt-10">
              <div className="prose prose-sm text-gray-500 font-medium leading-relaxed max-w-none mb-10">
                {product.description}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 py-10 border-t border-gray-100">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                    <Truck size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black">Express Shipping</span>
                    <span className="text-xs text-gray-500">2-4 business days</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                    <ShieldCheck size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black">Authentic</span>
                    <span className="text-xs text-gray-500">100% Quality Assured</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                    <Share2 size={18} strokeWidth={1.5} />
                  </div>
                  <button onClick={handleWhatsAppShare} className="text-[10px] font-bold uppercase tracking-[0.1em] text-black hover:underline text-left">
                    Share This Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <ProductBundles currentProduct={product} />
        </div>

        <RelatedProducts currentId={product.id} category={product.category} />

        <div className="mt-32 pt-20 border-t border-gray-100">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Feedback</span>
            <h2 className="font-fashion-serif text-4xl italic font-black text-black">Customer Reviews</h2>
          </div>
          <Reviews />
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 px-6 py-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button
          onClick={handleBuyNow}
          disabled={isSoldOut}
          className="w-full py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
        >
          {isSoldOut ? 'Sold Out' : 'Quick Shop'}
        </button>
      </div>
    </div>
  );
};

const RelatedProducts = ({ currentId, category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = config.api.baseUrl;

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true);
        const rawCategory = Array.isArray(category) ? category[0] : category;
        if (!rawCategory) return;
        const slug = rawCategory.toLowerCase().replace(/\s+/g, '-');
        const res = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(slug)}&pageSize=8`);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        const list = data.products || (Array.isArray(data) ? data : []);
        setItems(list.filter(p => p.id !== Number(currentId)).slice(0, 4));
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRelated();
  }, [API_BASE_URL, category, currentId]);

  if (loading || !items.length) return null;

  return (
    <div className="mt-32">
      <div className="flex items-center justify-between mb-12">
        <h2 className="font-fashion-serif text-3xl italic font-black text-black">Complete The Look</h2>
        <Link href={`/category/${Array.isArray(category) ? category[0].toLowerCase() : (category || '').toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {items.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
