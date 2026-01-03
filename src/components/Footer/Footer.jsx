"use client";

import React from "react";
import config from "../../config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAuthorSignature } from "../../utils/signature";

const Footer = () => {
  const pathname = usePathname();
  const isStudio = pathname.startsWith('/admin');

  if (isStudio) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Newsletter Section */}
        <div className="border-b border-slate-800 pb-12 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-playfair font-bold text-white mb-2">Join our Newsletter</h3>
              <p className="text-slate-400">Get early access to new arrivals and exclusive offers.</p>
            </div>
            <form className="flex w-full md:w-auto max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-900/20 active:scale-95 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <span className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                {config.appName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              {config.description || "Discover a world of premium products, curated for quality and style. Your destination for modern shopping."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {config.socials && Object.entries(config.socials).map(([platform, handle]) => {
                if (!handle || platform === 'contactEmail' || platform === 'contactPhone' || platform === 'whatsapp') return null;
                return (
                  <a
                    key={platform}
                    href={`https://${platform}.com/${platform === 'twitter' ? handle.replace('@', '') : handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 rounded-full text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110"
                    aria-label={`Follow us on ${platform}`}
                  >
                    <span className="sr-only capitalize">{platform}</span>
                    {/* Icons based on platform name */}
                    {platform === 'instagram' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>}
                    {platform === 'facebook' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>}
                    {platform === 'twitter' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Link Columns */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Shop</h3>
            <ul className="space-y-4">
              {['Categories', 'New Arrivals', 'Best Sellers', 'Discounted', 'Recommendations'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Support</h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about-us' },
                { name: 'Order Tracking', path: '/track-order' },
                { name: 'Contact Us', path: '/contact-us' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Shipping Policy', path: '/shipping-policy' },
                { name: 'Returns', path: '/returns' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Contact</h3>
            <ul className="space-y-4">
              {config.socials?.contactPhone && (
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="text-sm text-slate-400">{config.socials.contactPhone}</span>
                </li>
              )}
              {config.socials?.whatsapp && (
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span className="text-sm text-slate-400">WA: {config.socials.whatsapp.replace('+', '')}</span>
                </li>
              )}
              {config.socials?.contactEmail && (
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-sm text-slate-400 break-all">{config.socials.contactEmail}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} {config.appName}. All rights reserved. Built by <span className="text-emerald-500 font-semibold">{getAuthorSignature(config._sig)}</span>
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
