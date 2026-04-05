"use client";
import React from "react";
import Image from "next/image";
import config from "@/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Magnetic from "@/components/common/UI/Magnetic";

const Footer = () => {
  const pathname = usePathname();
  const isStudio = pathname.startsWith('/admin');

  if (isStudio) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-black font-sans border-t border-gray-100">
      {/* Newsletter Section */}
      <div className="border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center lg:text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Newsletter</span>
              <h3 className="font-fashion-serif text-4xl italic font-black text-black tracking-tighter mb-4">
                Join The Club
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                Subscribe to receive updates, access to exclusive deals, and more.
              </p>
            </div>
            <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all"
                />
                <Magnetic>
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:translate-x-2 transition-transform"
                  >
                    <ArrowRight size={20} strokeWidth={1.5} />
                  </button>
                </Magnetic>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <div className="relative h-8 w-40">
                <Image
                  src="/logo.png"
                  alt={config.appName}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 font-medium max-w-xs">
              {config.description || "Elevating your everyday with curated pieces designed for the modern lifestyle. Minimalist, sophisticated, and sustainably minded."}
            </p>
            <div className="flex items-center gap-8">
              <Magnetic>
                <Instagram size={20} strokeWidth={1} className="cursor-pointer hover:text-black transition-colors" />
              </Magnetic>
              <Magnetic>
                <Facebook size={20} strokeWidth={1} className="cursor-pointer hover:text-black transition-colors" />
              </Magnetic>
              <Magnetic>
                <Twitter size={20} strokeWidth={1} className="cursor-pointer hover:text-black transition-colors" />
              </Magnetic>
            </div>
          </div>

          {/* Quick Link Columns */}
          <div>
            <h3 className="text-black text-[11px] font-bold uppercase tracking-[0.3em] mb-8">Shop</h3>
            <ul className="space-y-4">
              {['New Arrivals', 'Best Sellers', 'Dresses', 'Accessories', 'Sale'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/category/${item.toLowerCase()}`}
                    className="text-sm text-gray-500 hover:text-black transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-black text-[11px] font-bold uppercase tracking-[0.3em] mb-8">Information</h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about-us' },
                { name: 'Shipping Policy', path: '/shipping-policy' },
                { name: 'Returns & Exchanges', path: '/returns' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Contact Us', path: '/contact-us' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm text-gray-500 hover:text-black transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-black text-[11px] font-bold uppercase tracking-[0.3em] mb-8">Get In Touch</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 font-medium leading-relaxed">
                  123 Fashion Ave, Suite 456<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 font-medium">
                  +1 (555) 000-0000
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 font-medium">
                  hello@coolcache.shop
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              © {currentYear} {config.appName}. All rights reserved.
            </p>
            <div className="flex gap-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale opacity-50 hover:opacity-100 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 grayscale opacity-50 hover:opacity-100 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 grayscale opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
