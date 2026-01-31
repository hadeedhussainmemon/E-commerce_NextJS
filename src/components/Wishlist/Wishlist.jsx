import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ProductCard/ProductCard';
import { motion } from 'framer-motion';
import { triggerPremiumFeedback } from '../../utils/feedback';
import { Heart, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => (item.stock > 0 || item.stock === undefined));

    if (inStockItems.length === 0) {
      toast.error('No pieces available to add.');
      return;
    }

    inStockItems.forEach(item => {
      addToCart(item);
    });

    toast.success(`Moved ${inStockItems.length} pieces to your bag.`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40">
        <div className="text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Heart className="w-16 h-16 text-gray-200 stroke-[1px]" />
          </motion.div>
          <div className="max-w-md mx-auto space-y-8 px-6">
            <h2 className="font-fashion-serif text-4xl italic font-black text-black tracking-tighter">Your Curation is Empty</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Discover and save the pieces that speak to you. Your personal curation starts here.
            </p>
          </div>
          <motion.div className="mt-12">
            <Link
              href="/"
              onClick={() => triggerPremiumFeedback('success', 'light')}
              className="inline-flex items-center gap-4 px-12 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
            >
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 pb-12 border-b border-gray-100">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 block">Personal Selection</span>
          <h1 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black tracking-tighter leading-none">
            My Wishlist
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddAllToCart}
            className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
          >
            Move All to Bag
          </button>
          <button
            onClick={clearWishlist}
            className="px-10 py-5 border border-gray-100 text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all"
          >
            Clear Curation
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
