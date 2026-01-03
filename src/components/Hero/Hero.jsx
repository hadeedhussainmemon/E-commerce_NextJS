"use client";

import React, { useEffect, useRef, useState } from "react";
import config from "../../config";
import getImageUrl from '../../utils/imageUrl';
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

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

  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const xParallax = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), { stiffness: 100, damping: 30 });
  const yParallax = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), { stiffness: 100, damping: 30 });
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-50, 50]), { stiffness: 50, damping: 20 });
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-50, 50]), { stiffness: 50, damping: 20 });
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
      ref={heroRef}
      onMouseMove={handleMouseMove}
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
          style={{ x: bgX, y: bgY }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-full bg-emerald-500/10 rounded-full blur-[40px] gpu-accelerated"
        />
        <motion.div
          style={{ x: useTransform(bgX, v => -v), y: useTransform(bgY, v => -v) }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-indigo-500/10 rounded-full blur-[40px] gpu-accelerated"
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
                    style={{ x: xParallax, y: yParallax }}
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
                    <h1 className="text-5xl lg:text-8xl font-display font-black leading-[0.95] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] tracking-tighter">
                      {config.tagline.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? "text-emerald-500" : ""}>{word} </span>
                      ))}
                    </h1>
                    <p className="mt-8 text-xl text-slate-300 leading-relaxed font-medium drop-shadow-lg max-w-md">
                      {config.description}
                    </p>
                    <div className="mt-12 flex flex-wrap items-center gap-8">
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href="#products"
                        className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-900/40 transition-all flex items-center gap-3 group uppercase text-xs tracking-[0.2em]"
                      >
                        Initiate Store
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </motion.a>
                      <button className="flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md relative group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                          <svg className="w-5 h-5 text-white group-hover:text-emerald-500 transition-colors fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-500 transition-colors">Visual Archive</p>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Watch Identity</p>
                        </div>
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
                <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center sm:text-left"
                  >
                    <h2 className="text-3xl font-display font-black text-white leading-[1.1] mb-2">
                      Everything in <span className="text-emerald-500">one cart</span>
                    </h2>
                    <p className="text-slate-300 text-xs font-medium mb-6 leading-relaxed px-4 sm:px-0">
                      Electronics, luxury watches, and curated finds — premium quality at your fingertips.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-0">
                      <a href="#products" className="flex-1 bg-white text-slate-900 h-12 rounded-2xl flex items-center justify-center font-black shadow-xl active:scale-95 transition-transform text-sm">
                        Shop Collection
                      </a>
                      <button className="flex-1 bg-emerald-600/20 backdrop-blur-md text-emerald-400 h-12 rounded-2xl flex items-center justify-center font-bold border border-emerald-500/30 text-sm">
                        Discover More
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
