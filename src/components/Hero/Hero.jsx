"use client";

import React, { useEffect, useRef, useState } from "react";
import config from "../../config";
import getImageUrl from '../../utils/imageUrl';
import Image from "next/image";

// Hero component with a lightweight image slider.
// - Accepts `images` prop: array of image URLs (your pictures). If not provided, uses the default image.
// - Autoplays slowly (7s), fades between slides, pauses on hover, and shows clickable indicators.
const Hero = ({ images = null, interval = 4000 }) => {
  // Use the backend-hosted hero images (these exist under Backend/public/images/hero)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ? String(process.env.NEXT_PUBLIC_API_BASE_URL).replace(/\/$/, '') : (typeof window !== 'undefined' && window.__APP_CONFIG__?.API_BASE_URL || '').replace(/\/$/, '');
  // Use centralized getImageUrl for constructing hero image URLs.
  const defaultImages = [
    getImageUrl('/hero/1.avif'),
    getImageUrl('/hero/2.avif'),
    getImageUrl('/hero/3.avif'),
    getImageUrl('/hero/4.avif'),
    getImageUrl('/hero/5.avif'),
    getImageUrl('/hero/6.avif'),
    getImageUrl('/hero/7.avif'),
    getImageUrl('/hero/8.avif'),
    getImageUrl('/hero/9.avif'),
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

      {/* Mobile gradient background */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black opacity-90" aria-hidden="true"></div>
      {/* Desktop gradient */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-slate-900 to-black" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
        <div
          className="w-full mt-6 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full h-[40vh] sm:h-[48vh] md:h-[460px] relative overflow-hidden md:rounded-2xl md:shadow-xl">
            <div className="flex flex-col md:flex-row h-full">
              {/* Desktop/tablet: left text, right image */}
              <div className="hidden md:flex w-3/5 items-center p-10">
                <div className="max-w-lg">
                  <h1 className="text-4xl lg:text-5xl font-playfair font-extrabold leading-tight text-white">
                    {config.tagline}
                  </h1>
                  <p className="mt-3 text-lg text-white/90">
                    {config.description}
                  </p>
                  <div className="mt-6">
                    <a
                      href="#products"
                      className="inline-block bg-white text-emerald-700 font-bold px-6 py-3 rounded-lg shadow hover:shadow-md transition-shadow duration-150"
                    >
                      Shop products
                    </a>
                  </div>
                </div>
              </div>

              {/* Image area (used on all sizes). We'll add a mobile overlay for small screens. */}
              <div
                className="w-full h-full md:w-2/5 relative overflow-hidden md:rounded-r-2xl bg-gradient-to-br from-emerald-500 to-indigo-600"
                style={{}}
              >
                {/* Optimized image loading strategy - enabled for mobile too for better LCP */}
                {slidesToShow.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`Hero slide ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className={`object-cover transition-opacity duration-700 ease-linear ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    style={{
                      willChange: 'opacity'
                    }}
                    draggable={false}
                    priority={i === 0}
                  />
                ))}

                {/* mobile overlay: centered text on top of image for small screens */}
                <div className="md:hidden absolute inset-0 z-20 flex items-center justify-center px-4">
                  <div className="w-full max-w-md text-center">
                    <h1 className="text-4xl sm:text-5xl font-playfair font-extrabold text-white leading-tight mb-4 animate-fade-in-up"
                      style={{
                        textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '-0.02em'
                      }}
                      itemProp="slogan">
                      Everything in one cart
                    </h1>
                    <p className="mt-3 text-base sm:text-lg text-white/95 leading-relaxed font-medium animate-fade-in-up"
                      style={{
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        animationDelay: '0.1s'
                      }}
                      itemProp="description">
                      Electronics, watches, gifts and special finds — curated and ready to ship.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <a
                        href="#products"
                        className="group relative inline-block bg-gradient-to-r from-white to-gray-50 text-emerald-700 font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 w-full max-w-xs text-center overflow-hidden"
                        aria-label="Browse our collection"
                        rel="nofollow"
                        itemProp="hasOfferCatalog"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Shop Now
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* loading spinner while images are being prepared */}
                {!isMobile && isLoadingImages && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/25">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    <span className="sr-only">Loading hero images</span>
                  </div>
                )}
              </div>

              {/* Removed duplicate mobile text section */}
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Hero;
