"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Magnetic from "@/components/common/UI/Magnetic";
import config from "@/config";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(springX, [-1000, 1000], [-30, 30]);
  const parallaxY = useTransform(springY, [-1000, 1000], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(timer);
    };
  }, [mouseX, mouseY]);

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image with Parallax */}
          <motion.div 
            style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
            className="relative h-full w-full"
          >
            <Image
              src={HERO_SLIDES[current].image}
              alt={HERO_SLIDES[current].title}
              fill
              className="object-cover opacity-80"
              priority
            />
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </motion.div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className={`max-w-3xl ${HERO_SLIDES[current].align === "center" ? "mx-auto text-center" : "text-left"}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.6em] text-white/80 drop-shadow-sm">
                    {config.appName} — Limited Collection
                  </span>

                  <h1 className="font-fashion-serif text-7xl md:text-[10rem] text-white italic font-black leading-[0.85] tracking-[-0.05em] mb-12 drop-shadow-2xl">
                    {HERO_SLIDES[current].title.split(" ").map((word, i) => (
                      <span key={i} className="block relative">
                        {word}
                      </span>
                    ))}
                  </h1>

                  <p 
                    className="text-lg md:text-2xl text-white/90 font-medium max-w-xl drop-shadow-sm leading-relaxed tracking-tight"
                    style={{ margin: HERO_SLIDES[current].align === 'center' ? '0 auto 4rem' : '0 0 4rem' }}
                  >
                    {HERO_SLIDES[current].subtitle}
                  </p>

                  <div className={`flex ${HERO_SLIDES[current].align === "center" ? "justify-center" : "justify-start"}`}>
                    <Magnetic>
                      <Link
                        href={HERO_SLIDES[current].link}
                        className="group relative inline-flex items-center gap-6 px-12 py-5 bg-white text-black text-[12px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-black hover:text-white overflow-hidden"
                      >
                        <span className="relative z-10">{HERO_SLIDES[current].cta}</span>
                        <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-2" />
                        <motion.div
                          className="absolute inset-0 bg-black translate-y-full"
                          whileHover={{ translateY: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </Link>
                    </Magnetic>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-6 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors"
          >
            <span className={`text-[10px] font-bold tracking-widest transition-all ${i === current ? "text-white opacity-100" : "opacity-0 group-hover:opacity-40"}`}>
              0{i + 1}
            </span>
            <div className={`h-[2px] transition-all duration-700 ${i === current ? "w-16 bg-white" : "w-8 bg-white/20 group-hover:w-12"}`} />
          </button>
        ))}
      </div>

      {/* Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 right-12 hidden md:block"
      >
        <div className="flex flex-col items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50 [writing-mode:vertical-lr] rotate-180">Scroll Explore</span>
          <div className="w-[1px] h-20 bg-white/10 relative overflow-hidden">
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
