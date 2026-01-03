"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import config from "../../config";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCartAnimation } from "../../context/CartAnimationContext";
import SearchAutocomplete from "../Search/SearchAutocomplete";
import Image from "next/image";

const LOGO_PATH = "/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartItemsCount, toggleCart } = useCart();
  const { wishlistItems } = useWishlist();
  const { cartIconRef } = useCartAnimation();
  const router = useRouter();
  const pathname = usePathname();


  const navigate = (path) => router.push(path);
  const location = { pathname }; // Compatibility shim
  const cartItemsCount = getCartItemsCount();
  const wishlistCount = wishlistItems.length;
  const [navSearch, setNavSearch] = useState("");

  // Memoized close handler
  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e) => {
      const target = e.target;
      if (
        target instanceof Element &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen, closeMenu]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeMenu]);

  // Optimized smooth scroll function with requestAnimationFrame
  const scrollToSection = useCallback((e, sectionId) => {
    e.preventDefault();
    closeMenu();

    const performScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 92; // navbar + announcement height
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - offset;

        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(performScroll, 150);
    } else {
      performScroll();
    }
  }, [location.pathname, navigate, closeMenu]);

  // Instagram username with fallback
  // Instagram username with fallback
  const instagramUsername = "coolcache"; // config.socials.instagram logic is simpler if in config

  // Ensure body has padding for pages with navbar
  useEffect(() => {
    document.body.classList.add('has-fixed-nav');
    return () => document.body.classList.remove('has-fixed-nav');
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K to open search
  useEffect(() => {
    const onKey = (e) => {
      // Ignore when typing in inputs to avoid interrupting users
      const el = e.target;
      if (el && el.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // Memoize active route checks
  const isHomePage = location.pathname === "/";
  const isCategoryPage = location.pathname.startsWith('/category');
  const isRecommendationsPage = location.pathname.startsWith('/recommendations');

  return (
    <nav className="fixed w-full top-0 z-50 will-change-transform font-sans">
      {/* Announcement bar */}
      <div className="bg-slate-900 text-white text-[11px] md:text-xs overflow-hidden h-8 flex items-center relative z-20 shadow-sm border-b border-white/5">
        <div className="hidden md:block absolute left-4 text-emerald-400 font-bold tracking-tight z-10">
          PREMIUM QUALITY
        </div>
        <div className="w-full h-full flex items-center overflow-hidden relative">
          <div className="animate-scroll-rtl whitespace-nowrap flex items-center w-full justify-center md:justify-start">
            <span className="mx-6 font-medium">✨ Premium Shopping Experience</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium">🚀 Fast Delivery</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium">💳 Secure Payment</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium">💎 100% Authentic</span>
            <span className="mx-2 text-slate-600">•</span>
            {/* Duplicate for infinite loop */}
            <span className="mx-6 font-medium">✨ Premium Shopping Experience</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium">🚀 Fast Delivery</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium">💳 Secure Payment</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium">💎 100% Authentic</span>
          </div>
        </div>
      </div>

      <div className="glass bg-white/90 shadow-sm border-b border-slate-100 transition-all duration-300" style={{ height: 'var(--nav-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">

            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                onClick={(e) => scrollToSection(e, "home")}
                className="flex items-center gap-3 group hover:opacity-95 transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                  <Image
                    src={LOGO_PATH}
                    alt={config.appName}
                    width={48}
                    height={48}
                    className="h-10 w-10 sm:h-11 sm:w-11 object-contain relative z-10"
                    priority
                  />
                </div>
                <div className="hidden sm:flex sm:flex-col justify-center">
                  <span className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                    {config.appName}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold group-hover:text-emerald-600 transition-colors leading-tight mt-0.5">
                    {config.tagline || 'Store'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-1 lg:gap-2">
              <Link
                href="/categories"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isCategoryPage
                    ? 'text-emerald-700 bg-emerald-50 shadow-sm ring-1 ring-emerald-100'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
              >
                Categories
              </Link>

              <Link
                href="/recommendations"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isRecommendationsPage
                    ? 'text-emerald-700 bg-emerald-50 shadow-sm ring-1 ring-emerald-100'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
              >
                For You
              </Link>

              {/* Quick Shortcuts */}
              <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-2 ml-2">
                {['Watches', 'Electronics', 'Bags'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat}`}
                    className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden xl:block w-72 ml-4">
                <SearchAutocomplete
                  value={navSearch}
                  onChange={setNavSearch}
                  onSubmit={(val) => {
                    const q = typeof val === 'string' && val.length ? val : navSearch;
                    if (q && q.trim()) {
                      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                      setNavSearch("");
                    }
                  }}
                  placeholder="Search products..."
                  className="w-full"
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {/* Search Toggle (Tablet/Laptop) */}
              <button
                onClick={() => navigate('/search')}
                className="xl:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </button>

              {/* My Orders */}
              <button
                onClick={() => navigate('/my-orders')}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative group"
                aria-label="My Orders"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Orders</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative group"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                ref={cartIconRef}
                onClick={toggleCart}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative group"
                aria-label="Shopping Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={() => navigate('/search')} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </button>

              <button onClick={toggleCart} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-1 ring-white">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg menu-button"
                aria-label="Menu"
              >
                <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl animate-slideIn max-h-[calc(100vh-var(--nav-height))] overflow-y-auto">
            <div className="p-4 space-y-2">
              <Link
                href="/"
                onClick={(e) => { scrollToSection(e, "home"); closeMenu(); }}
                className={`block px-4 py-3 rounded-xl text-base font-semibold ${isHomePage ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Home
              </Link>
              <Link
                href="/categories"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-xl text-base font-semibold ${isCategoryPage ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Categories
              </Link>
              <Link
                href="/recommendations"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-xl text-base font-semibold ${isRecommendationsPage ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                For You
              </Link>

              <div className="py-2 border-t border-slate-100 my-2">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Account</p>
                <Link href="/my-orders" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50">My Orders</Link>
                <Link href="/wishlist" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between">
                  <span>Wishlist</span>
                  {wishlistCount > 0 && <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                </Link>
              </div>

              <div className="py-2 border-t border-slate-100 my-2">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Socials</p>
                <a href={`https://www.instagram.com/${instagramUsername}`} target="_blank" rel="noopener" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  <span>@{instagramUsername}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
