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
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

        {/* Simplified static gradients - no animation for performance */}
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          className="w-full mt-6 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full h-[55vh] sm:h-[65vh] md:h-[750px] relative overflow-hidden md:rounded-[3rem] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Content (Desktop) */}
              <div className="hidden md:flex w-3/5 items-center p-12 lg:p-20 bg-slate-950/40 backdrop-blur-md">
                <div key={index} className="max-w-lg">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Online: Operational Zenith
                  </div>

                  <h1 className="text-6xl lg:text-[7.5rem] font-display font-black leading-[0.85] text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] tracking-tighter mb-8">
                    {config.tagline.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className={`${i === 1 ? "text-emerald-500" : ""} block`}
                      >
                        {word}
                      </span>
                    ))}
                  </h1>

                  <p className="text-lg text-slate-300 leading-relaxed font-medium max-w-sm mb-12 border-l-2 border-emerald-500/30 pl-6 opacity-70">
                    {config.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-10">
                    <a
                      href="#products"
                      className="px-12 py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(16,185,129,0.4)] transition-all flex items-center gap-4 group uppercase text-[10px] tracking-[0.3em] ring-1 ring-emerald-400/20 hover:scale-105 active:scale-95"
                    >
                      Initiate Store
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>

                    <button className="flex items-center gap-5 group">
                      <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-xl relative group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40 transition-all duration-700">
                        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg className="w-6 h-6 text-white group-hover:text-emerald-500 transition-colors fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-emerald-500 transition-colors mb-1">Visual Archive</p>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Watch Identity</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Content (Image) */}
              <div className="w-full h-full md:w-2/5 relative overflow-hidden bg-slate-950">
                <div key={index} className="absolute inset-0">
                  <Image
                    src={slidesToShow[index]}
                    alt={config.appName}
                    fill
                    priority
                    className="object-cover"
                  />
                  {/* Multi-layer Gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-l" />
                  <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
                </div>

                {/* Mobile Identity Overlay */}
                <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end p-10 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                  <div key={index} className="w-full">
                    <h2 className="text-4xl font-display font-black text-white leading-[0.9] mb-4 tracking-tighter">
                      Everything in <span className="text-emerald-500">Zenith</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                      Curated horology and lifestyle technology for the elite connoisseur.
                    </p>
                    <div className="flex flex-col gap-4">
                      <a href="#products" className="w-full bg-white text-slate-900 h-14 rounded-2xl flex items-center justify-center font-black shadow-2xl active:scale-95 transition-transform text-xs tracking-widest uppercase">
                        Shop Collection
                      </a>
                    </div>
                  </div>
                </div>

                {/* Technical Index Indicators */}
                <div className="absolute bottom-10 right-10 z-30 flex flex-col gap-3">
                  {slidesToShow.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className="group flex items-center gap-4 py-1"
                    >
                      <span className={`text-[9px] font-black transition-all ${i === index ? 'text-emerald-500 translate-x-0 opacity-100' : 'text-white/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                        0{i + 1}
                      </span>
                      <div className={`h-1 cursor-pointer transition-all duration-500 rounded-full ${i === index ? 'w-12 bg-emerald-500' : 'w-4 bg-white/10 group-hover:bg-white/30'}`} />
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
