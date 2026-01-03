import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ProductCard/ProductCard';

const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => (item.stock > 0 || item.stock === undefined)); // Assume in stock if undefined/unknown to be safe, or stricter >0

    if (inStockItems.length === 0) {
      toast.error('No in-stock items to add!');
      return;
    }

    inStockItems.forEach(item => {
      addToCart(item);
    });

    const skipped = wishlistItems.length - inStockItems.length;
    if (skipped > 0) {
      toast.success(`Added ${inStockItems.length} items to cart. (${skipped} out of stock)`);
    } else {
      toast.success(`Added all ${inStockItems.length} items to cart!`);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 md:mb-0">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-6 ring-8 ring-emerald-50/50">
            <svg className="w-12 h-12 text-emerald-600 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-slate-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Save your favorite products to your wishlist and shop them later! Your curated collection starts here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all duration-300 font-semibold active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-24 md:mb-0 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-4xl font-playfair font-bold text-slate-900 mb-2">
            My Wishlist <span className="text-emerald-500">❤️</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddAllToCart}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all duration-300 font-bold active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Move All to Cart
          </button>
          <button
            onClick={clearWishlist}
            className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300 font-semibold active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
