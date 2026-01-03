"use client";

import React, { useEffect, useRef, useState } from "react";
import config from "../../config";
import getImageUrl from '../../utils/imageUrl';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Hero component with a lightweight image slider.
// - Accepts `images` prop: array of image URLs (your pictures). If not provided, uses the default image.
// - Autoplays slowly (7s), fades between slides, pauses on hover, and shows clickable indicators.
const Hero = ({ images = null, interval = 4000 }) => {
  // Use the backend-hosted hero images (these exist under Backend/public/images/hero)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ? String(process.env.NEXT_PUBLIC_API_BASE_URL).replace(/\/$/, '') : (typeof window !== 'undefined' && window.__APP_CONFIG__?.API_BASE_URL || '').replace(/\/$/, '');
  // Use centralized getImageUrl for constructing hero image URLs.
  const defaultImages = [
    getImageUrl('/images/banners/mens-brown-leather-strap-watch.avif'),
    getImageUrl('/images/banners/stainless-stell-rolex-watch-blue-dial.avif'),
    getImageUrl('/images/banners/cute-korean-style-bag-for-girls-blue-color.avif'),
    getImageUrl('/images/banners/flower-rose-red-golden-wrist-watch-women.avif'),
    getImageUrl('/images/banners/iced-diamond-leopard-print-watches-for-couple.avif'),
    getImageUrl('/images/banners/mens-stainless-steel-square-dial-watch.avif'),
  ];
  // slidesToShow will contain only images that successfully load.
  const [slidesToShow, setSlidesToShow] = useState([]);
  const candidateSlides = images && images.length ? images : defaultImages;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Detect mobile once on mount to avoid SSR/hydration mismatch
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debug: log where hero images are loading from and which candidates are used
  // (debug logs removed)
  useEffect(() => {
    // no-op; kept to trigger re-evaluation when `images` prop changes
  }, [images]);

  // Preload logic kept but Image component handles most
  useEffect(() => {
    // Simplified hydration logic for slides
    setSlidesToShow(candidateSlides);
  }, [images]);

  // (debug logs removed)
  useEffect(() => {
    // no-op
  }, [slidesToShow]);

  // autoplay using slidesToShow
  useEffect(() => {
    if (isPaused) return;
    if (!slidesToShow || slidesToShow.length === 0) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slidesToShow.length);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [slidesToShow, interval, isPaused]);

  // Loading indicator while images are being prepared
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  useEffect(() => {
    if (!slidesToShow) return;
    setIsLoadingImages(slidesToShow.length === 0);
  }, [slidesToShow]);




  return (
    <section
      id="home"
      aria-label={`Welcome to ${config.appName}`}
      className="text-white py-8 md:py-20 relative overflow-hidden"
      itemScope
      itemType="https://schema.org/Store"
    >
      <meta itemProp="name" content={config.appName} />
      <meta itemProp="description" content={config.description} />
      <meta itemProp="url" content={config.api.baseUrl} />
      <link itemProp="image" href={`${config.api.baseUrl}/og-image.jpg`} />

      {/* Cinema Background (Abstract Shapes) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-full bg-emerald-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-indigo-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          className="w-full mt-6 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full h-[50vh] sm:h-[60vh] md:h-[550px] relative overflow-hidden md:rounded-[2.5rem] md:shadow-2xl md:shadow-emerald-900/10 border border-white/5">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Content (Desktop) */}
              <div className="hidden md:flex w-3/5 items-center p-12 lg:p-16 bg-slate-900/40 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="max-w-lg"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Limited Collection
                    </motion.div>
                    <h1 className="text-5xl lg:text-7xl font-display font-black leading-[1.1] text-white drop-shadow-2xl">
                      {config.tagline.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? "text-emerald-500" : ""}>{word} </span>
                      ))}
                    </h1>
                    <p className="mt-6 text-lg text-slate-300 leading-relaxed font-medium">
                      {config.description}
                    </p>
                    <div className="mt-10 flex items-center gap-6">
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href="#products"
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all flex items-center gap-3 group"
                      >
                        Shop the collection
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </motion.a>
                      <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        Watch Video
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Content (Image) */}
              <div className="w-full h-full md:w-2/5 relative overflow-hidden bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1, rotate: 1 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0.5, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slidesToShow[index]}
                      alt={config.appName}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent md:bg-gradient-to-l" />
                  </motion.div>
                </AnimatePresence>

                {/* Mobile Overlay */}
                <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <h2 className="text-4xl font-display font-black text-white leading-[1.1] mb-4">
                      Everything in <span className="text-emerald-500 underline decoration-slate-500/30">one cart</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                      Electronics, luxury watches, and curated finds — premium quality at your fingertips.
                    </p>
                    <div className="flex gap-3">
                      <a href="#products" className="flex-1 bg-white text-slate-900 h-14 rounded-2xl flex items-center justify-center font-black shadow-xl active:scale-95 transition-transform">
                        Shop Collection
                      </a>
                      <button className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Index Indicators */}
                <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                  {slidesToShow.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className="group p-2"
                    >
                      <div className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-emerald-500' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Hero;
