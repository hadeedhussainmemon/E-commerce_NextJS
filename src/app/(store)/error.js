"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

export default function StoreError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Storefront Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="relative group mb-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-full ring-1 ring-slate-100 shadow-xl overflow-hidden">
          <AlertCircle className="w-12 h-12 text-emerald-600 stroke-[1.5] transition-transform duration-500 group-hover:scale-110" />
        </div>
      </div>

      <div className="max-w-md text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
          Something went wrong.
        </h2>
        <p className="text-lg text-slate-600 font-medium">
          We encountered a temporary issue while loading this page. Our team has been notified.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:shadow-emerald-900/20 active:scale-95 transition-all duration-300"
        >
          <RefreshCcw className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold hover:border-slate-900 active:scale-95 transition-all duration-300"
        >
          <Home className="w-5 h-5 text-slate-400 transition-colors group-hover:text-slate-900" />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] pointer-events-none opacity-[0.03]">
        <div className="w-full h-full border-[100px] border-emerald-600 rounded-full" />
      </div>
    </div>
  );
}
