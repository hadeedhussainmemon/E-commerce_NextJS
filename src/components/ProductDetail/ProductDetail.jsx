import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useProductQuery } from '../../hooks/useProductQuery';
import { useCartAnimation } from '../../context/CartAnimationContext';
import useTrackProductView from '../../hooks/useTrackProductView';
import SEO from '../SEO/SEO';
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
    brand: { '@type': 'Brand', name: 'CoolCache' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.price,
      availability: isSoldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `https://www.coolcache.app/product/${product.slug || product.id}`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 font-sans">
      <SEO
        title={`${product.title} | CoolCache Pakistan`}
        description={`Buy ${product.title} - ${String(product.description || '').substring(0, 150)}...`}
        canonical={`https://www.coolcache.app/product/${product.slug || product.id}`}
        image={imageUrl}
        type="product"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        {/* Product Image */}
        <div className="relative aspect-square sm:aspect-auto h-full min-h-[400px]">
          {isSoldOut && (
            <div className="absolute top-4 left-4 bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-bold z-10 shadow-lg">
              Sold Out
            </div>
          )}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
            <Image
              src={getImageUrl(product.image)}
              alt={product.title}
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-slate-900 leading-tight">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 border-b border-slate-100 pb-6">
            <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
              {Array.isArray(product.category) ? product.category.join(', ') : product.category}
            </span>
            {product.material && product.material.toLowerCase() !== 'handmade' && (
              <span>{product.material}</span>
            )}
          </div>

          {/* Price */}
          <div className="mb-8">
            {product.price > 0 ? (
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-4xl font-bold text-slate-900">
                  {config.currency.symbol} {product.price.toLocaleString('en-PK')}
                </span>
                <span className="text-lg text-slate-400 line-through mb-1.5">
                  {config.currency.symbol} {Math.round(product.price * 1.25).toLocaleString('en-PK')}
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 mb-2 rounded-full">
                  20% OFF
                </span>
              </div>
            ) : (
              <div className="text-2xl text-slate-500">Contact for price</div>
            )}
            <p className="text-sm text-slate-400 mt-2">Tax included. Shipping calculated at checkout.</p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <div className="text-sm font-medium text-slate-900 mb-3">Select Color</div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 shadow-sm transition-all ${selectedColor === c ? 'ring-2 ring-offset-2 ring-emerald-500 border-emerald-500 scale-110' : 'border-slate-200 hover:scale-105'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {product.price > 0 && !isSoldOut ? (
              <>
                <button
                  onClick={handleAddToCartWithAnimation}
                  className="flex-1 px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-900 font-bold hover:border-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-8 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200 transition-all active:scale-[0.98]"
                >
                  Buy Now
                </button>
              </>
            ) : (
              <button disabled className="w-full py-4 rounded-xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed">
                {isSoldOut ? 'Sold Out' : 'Contact for Price'}
              </button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Truck className="text-emerald-500" size={20} />
              <span>Fast Delivery (2-4 Days)</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-500" size={20} />
              <span>Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="text-emerald-500" size={20} />
              <span>Cash on Delivery Available</span>
            </div>
            <button onClick={handleWhatsAppShare} className="flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-colors text-left">
              <Share2 size={20} />
              <span>Share with Friends</span>
            </button>
          </div>

          {/* Description */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
            <div className="prose prose-slate text-slate-600 leading-relaxed max-w-none">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      <ProductBundles currentProduct={product} />
      <RelatedProducts currentId={product.id} category={product.category} />

      <div className="mt-16 pt-10 border-t border-slate-200">
        <Reviews />
      </div>

      {/* Mobile Sticky Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 p-4 shadow-2xl safe-area-bottom">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCartWithAnimation}
            disabled={isSoldOut}
            className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-900"
          >
            Add
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className="flex-[2] py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg"
          >
            Buy Now
          </button>
        </div>
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
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-slate-900">You might also like</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
