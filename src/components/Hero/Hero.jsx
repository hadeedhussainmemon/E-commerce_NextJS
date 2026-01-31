"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    title: "New Season Arrivals",
    subtitle: "Discover the latest trends in sustainable fashion.",
    cta: "Shop The Collection",
    link: "/new-arrivals",
    align: "left"
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    title: "The Weekend Edit",
    subtitle: "Effortless styles for your next getaway.",
    cta: "Explore Dresses",
    link: "/category/dresses",
    align: "center"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={HERO_SLIDES[current].image}
              alt={HERO_SLIDES[current].title}
              fill
              className="object-cover"
              priority
            />
            {/* Subtle Overlay for Text Readability */}
            <div className={`absolute inset-0 bg-black/10`} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className={`max-w-2xl ${HERO_SLIDES[current].align === "center" ? "mx-auto text-center" : "text-left"}`}>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-block text-[11px] font-bold uppercase tracking-[0.4em] text-white mb-6 drop-shadow-sm"
                >
                  Limited Collection
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="font-fashion-serif text-6xl md:text-8xl text-white italic font-black leading-tight tracking-tighter mb-8 drop-shadow-md"
                >
                  {HERO_SLIDES[current].title.split(" ").map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-lg md:text-xl text-white font-medium mb-12 max-w-lg drop-shadow-sm leading-relaxed"
                  style={{ margin: HERO_SLIDES[current].align === 'center' ? '0 auto 3rem' : '0 0 3rem' }}
                >
                  {HERO_SLIDES[current].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className={`flex ${HERO_SLIDES[current].align === "center" ? "justify-center" : "justify-start"}`}
                >
                  <Link
                    href={HERO_SLIDES[current].link}
                    className="btn-fashion flex items-center gap-3 group px-10 py-4"
                  >
                    {HERO_SLIDES[current].cta}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full ${i === current ? "w-12 h-1 bg-white" : "w-2 h-1 bg-white/40 hover:bg-white/60"
              }`}
          />
        ))}
      </div>

      {/* Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 right-10 hidden md:block"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white vertical-text transform -rotate-90">Scroll</span>
          <div className="w-px h-16 bg-white/30 relative overflow-hidden">
            <motion.div
              animate={{ top: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-1/2 bg-white"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
