import React, { useState, useEffect, useCallback } from "react";
import config from "../../config";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import GlobalSearchOverlay from "../Search/GlobalSearchOverlay";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";

const LOGO_PATH = "/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartItemsCount, toggleCart } = useCart();
  const { wishlistItems } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const cartItemsCount = getCartItemsCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.add('has-fixed-nav');
    return () => document.body.classList.remove('has-fixed-nav');
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const leftNav = [
    { label: "New In", href: "/new-arrivals" },
    { label: "Dresses", href: "/category/dresses" },
    { label: "Best Sellers", href: "/category/best-sellers" },
  ];

  const rightNav = [
    { label: "Clothing", href: "/categories" },
    { label: "Tops", href: "/category/tops" },
    { label: "Sale", href: "/category/sale" },
  ];

  return (
    <>
      <nav className="fixed w-full top-0 z-[100] transition-all duration-300">
        {/* Announcement Bar */}
        <div className="bg-white border-b border-gray-100 py-2.5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex justify-center items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              FREE SHIPPING ON ORDERS OVER Rs. 4999*
            </motion.div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className={`transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm h-16' : 'bg-white h-20'}`}>
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-800"
            >
              <Menu size={22} />
            </button>

            {/* Left Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {leftNav.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Centered Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-48">
                  <Image
                    src={LOGO_PATH}
                    alt="Petal + Pup"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Right Desktop Nav & Actions */}
            <div className="flex items-center justify-end gap-6 flex-1 h-full">
              <div className="hidden lg:flex items-center gap-8 mr-4">
                {rightNav.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSearchOverlayOpen(true)}
                  className="p-1.5 text-gray-800 hover:scale-110 transition-transform"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
                <Link href="/wishlist" className="p-1.5 text-gray-800 hover:scale-110 transition-transform relative hidden sm:block">
                  <Heart size={20} strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => router.push('/my-orders')}
                  className="p-1.5 text-gray-800 hover:scale-110 transition-transform hidden sm:block"
                >
                  <User size={20} strokeWidth={1.5} />
                </button>
                <button
                  onClick={toggleCart}
                  className="p-1.5 text-gray-800 hover:scale-110 transition-transform relative"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[201] shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="relative h-6 w-36">
                  <Image src={LOGO_PATH} alt="Petal + Pup" fill className="object-contain" />
                </div>
                <button onClick={closeMenu} className="p-2 text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="py-8 px-6 space-y-6">
                {[...leftNav, ...rightNav].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-sm font-bold uppercase tracking-[0.2em] text-gray-800"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-8 border-t border-gray-100 space-y-6">
                  <Link href="/my-orders" onClick={closeMenu} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <User size={18} /> Sign In
                  </Link>
                  <Link href="/wishlist" onClick={closeMenu} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <Heart size={18} /> Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <GlobalSearchOverlay isOpen={isSearchOverlayOpen} onClose={() => setIsSearchOverlayOpen(false)} />
    </>
  );
};

export default Navbar;
