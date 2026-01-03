"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import config from "../../config";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCartAnimation } from "../../context/CartAnimationContext";
import SearchAutocomplete from "../Search/SearchAutocomplete";
import GlobalSearchOverlay from "../Search/GlobalSearchOverlay";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_PATH = "/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const { getCartItemsCount, toggleCart } = useCart();
  const { wishlistItems } = useWishlist();
  const { cartIconRef } = useCartAnimation();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);


  const navigate = (path) => router.push(path);
  const location = { pathname }; // Compatibility shim
  const cartItemsCount = getCartItemsCount();
  const wishlistCount = wishlistItems.length;
  const [navSearch, setNavSearch] = useState("");

  // Handle scroll for glass header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Keyboard shortcut: Ctrl/Cmd + K to open search overlay
  useEffect(() => {
    const onKey = (e) => {
      // Ignore when typing in inputs to avoid interrupting users
      const el = e.target;
      if (el && el.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOverlayOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Memoize active route checks
  const isHomePage = location.pathname === "/";
  const isCategoryPage = location.pathname.startsWith('/category');
  const isRecommendationsPage = location.pathname.startsWith('/recommendations');

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out font-sans ${scrolled ? 'translate-y-[-36px]' : 'translate-y-0'}`}>
      {/* Announcement bar - Darker, Premium Gradient */}
      <div className={`bg-gradient-to-r from-slate-900 to-slate-800 text-white text-[11px] md:text-xs overflow-hidden h-9 flex items-center relative z-20 shadow-sm border-b border-white/5 transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="hidden md:flex items-center absolute left-6 text-emerald-400 font-bold tracking-wider z-10 gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          PREMIUM QUALITY
        </div>
        <div className="w-full h-full flex items-center overflow-hidden relative">
          <div className="animate-scroll-rtl whitespace-nowrap flex items-center w-full justify-center md:justify-end md:pr-10">
            <span className="mx-6 font-medium flex items-center gap-2"><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Premium Shopping Experience</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium flex items-center gap-2">🚀 Fast Delivery</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium flex items-center gap-2">💳 Secure Payment</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="mx-6 font-medium flex items-center gap-2">💎 100% Authentic</span>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out border-b border-slate-100/50 ${scrolled
        ? 'bg-white/70 backdrop-blur-xl h-16 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.02]'
        : 'bg-white/80 backdrop-blur-2xl h-[calc(var(--nav-height))] shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-6">

            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                onClick={(e) => scrollToSection(e, "home")}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  <Image
                    src={LOGO_PATH}
                    alt={config.appName}
                    width={48}
                    height={48}
                    className="h-10 w-10 sm:h-11 sm:w-11 object-contain relative z-10 drop-shadow-sm group-hover:rotate-3 transition-transform duration-300"
                    priority
                  />
                </div>
                <div className="hidden sm:flex sm:flex-col justify-center">
                  <span className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
                    {config.appName}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold group-hover:text-emerald-500 transition-colors leading-tight mt-0.5">
                    {config.tagline || 'Store'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-1 lg:gap-2">
              {/* Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 group flex items-center gap-1.5 ${megaMenuOpen || isCategoryPage
                    ? 'text-emerald-700 bg-emerald-50/80'
                    : 'text-slate-600 hover:text-emerald-700'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  Categories
                  <svg className={`w-3 h-3 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-6"
                    >
                      <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-1 space-y-1">
                          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Shop By Category</p>
                          {['Watches', 'Electronics', 'Bags', 'Accessories'].map((cat) => (
                            <Link
                              key={cat}
                              href={`/category/${cat.toLowerCase()}`}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                {cat === 'Watches' && '⌚'}
                                {cat === 'Electronics' && '💻'}
                                {cat === 'Bags' && '🎒'}
                                {cat === 'Accessories' && '🕶️'}
                              </div>
                              {cat}
                            </Link>
                          ))}
                        </div>
                        <div className="col-span-2 border-l border-slate-100 pl-8">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Trending Now</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Link href="/category/luxury" className="group block">
                              <div className="aspect-[16/9] rounded-2xl bg-slate-100 mb-2 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 group-hover:opacity-100 opacity-0 transition-opacity" />
                                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-300">LUXURY</div>
                              </div>
                              <span className="text-sm font-bold text-slate-900">Luxury Watches</span>
                            </Link>
                            <Link href="/category/lifestyle" className="group block">
                              <div className="aspect-[16/9] rounded-2xl bg-slate-100 mb-2 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-teal-500/20 group-hover:opacity-100 opacity-0 transition-opacity" />
                                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-300">CASUAL</div>
                              </div>
                              <span className="text-sm font-bold text-slate-900">Lifestyle Gears</span>
                            </Link>
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-100">
                            <Link href="/categories" className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm hover:underline">
                              View All Categories <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/new-arrivals"
                className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 group overflow-hidden ${pathname === '/new-arrivals'
                  ? 'text-emerald-700 bg-emerald-50/80 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  New Arrivals
                </span>
              </Link>

              <Link
                href="/recommendations"
                className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 group overflow-hidden ${isRecommendationsPage
                  ? 'text-emerald-700 bg-emerald-50/80 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  Discover
                </span>
              </Link>

              {/* Quick Shortcuts */}
              <div className="hidden lg:flex items-center gap-1 border-l border-slate-200/60 pl-3 ml-3">
                {['Watches', 'Electronics', 'Bags'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 hover:bg-slate-50/80 rounded-full transition-all duration-200 border border-transparent hover:border-slate-100"
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden xl:block w-72 ml-6">
                <div
                  onClick={() => setIsSearchOverlayOpen(true)}
                  className="flex items-center gap-3 px-5 py-3 bg-slate-50/50 hover:bg-slate-100/50 border border-slate-100 hover:border-emerald-100 rounded-2xl cursor-pointer transition-all group"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" /></svg>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500 transition-colors">Quick search...</span>
                  <div className="ml-auto flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black border border-slate-200 px-1 py-0.5 rounded">⌘</span>
                    <span className="text-[10px] font-black border border-slate-200 px-1 py-0.5 rounded">K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {/* Search Toggle (Tablet/Laptop) */}
              <button
                onClick={() => setIsSearchOverlayOpen(true)}
                className="xl:hidden p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-full transition-all duration-300 hover:shadow-sm"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </button>

              {/* My Orders */}
              <button
                onClick={() => navigate('/my-orders')}
                className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-full transition-all duration-300 relative group hover:shadow-sm hover:-translate-y-0.5"
                aria-label="My Orders"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0">
                  Account <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900"></div>
                </span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-50/80 rounded-full transition-all duration-300 relative group hover:shadow-sm hover:-translate-y-0.5"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md ring-2 ring-white animate-fade-in-up">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                ref={cartIconRef}
                onClick={toggleCart}
                className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-full transition-all duration-300 relative group hover:shadow-sm hover:-translate-y-0.5"
                aria-label="Shopping Cart"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md ring-2 ring-white animate-fade-in-up">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button onClick={() => setIsSearchOverlayOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50/80 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </button>

              <button onClick={toggleCart} className="p-2 text-slate-600 hover:bg-slate-50/80 rounded-full relative transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-600 hover:bg-slate-50/80 rounded-full menu-button ml-1 transition-colors active:scale-95 duration-200"
                aria-label="Menu"
              >
                <div className="w-6 h-6 relative flex flex-col justify-center items-center gap-1.5">
                  <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay - Smoother Slide-In */}
        <div className={`md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeMenu}></div>

        <div className={`md:hidden fixed top-[var(--nav-height)] right-0 w-4/5 max-w-sm h-[calc(100vh-var(--nav-height))] bg-white/95 backdrop-blur-2xl border-l border-slate-100 shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 space-y-2 flex flex-col h-full">
            <div className="space-y-1">
              {[
                { label: 'Home', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { label: 'New Arrivals', href: '/new-arrivals', icon: 'M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Categories', href: '/categories', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                { label: 'Discover', href: '/recommendations', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
              ].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => { link.label === 'Home' ? scrollToSection(e, "home") : closeMenu(); }}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 ${(link.label === 'Home' && isHomePage) ||
                      (link.label === 'New Arrivals' && pathname === '/new-arrivals') ||
                      (link.label === 'Categories' && isCategoryPage) ||
                      (link.label === 'Discover' && isRecommendationsPage)
                      ? 'text-emerald-700 bg-emerald-50/80 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${(link.label === 'Home' && isHomePage) ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400'
                      }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={link.icon} /></svg>
                    </div>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="py-4 border-t border-slate-100 my-2 space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">My Account</p>
              <Link href="/my-orders" onClick={closeMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                My Orders
              </Link>
              <Link href="/wishlist" onClick={closeMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  Wishlist
                </div>
                {wishlistCount > 0 && <span className="text-xs bg-rose-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">{wishlistCount}</span>}
              </Link>
            </div>

            <div className="mt-auto py-6 border-t border-slate-100">
              <a href={`https://www.instagram.com/${instagramUsername}`} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl text-emerald-800 font-semibold transition-all duration-300 shadow-sm border border-emerald-100/50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                <span>Follow @{instagramUsername}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <GlobalSearchOverlay isOpen={isSearchOverlayOpen} onClose={() => setIsSearchOverlayOpen(false)} />
    </nav>
  );
};

export default Navbar;
