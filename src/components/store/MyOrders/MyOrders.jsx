"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import config from '@/config';

export default function MyOrders() {
  const [contact, setContact] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const API_BASE_URL = config.api.baseUrl;

  const handleSearch = async (e) => {
    e && e.preventDefault();
    if (!contact.trim()) return;
    setLoading(true);
    setError(null);
    setOrders([]);
    setSearched(true);

    try {
      const url = `${API_BASE_URL}/api/orders/customer/${encodeURIComponent(contact.trim())}`;
      const res = await fetch(url);
      if (res.status === 503) {
        setError('Service temporarily unavailable. Please try again later.');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to fetch orders');
      }

      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Unable to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('completed')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('process') || s.includes('pending')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s.includes('shipped') || s.includes('transit')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (s.includes('cancel')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-playfair font-bold text-slate-900 mb-4">Track Your Orders</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Enter your phone number or email address used at checkout to view your order history and current status.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-10 border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter phone number (e.g., 03001234567)"
            className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-900 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={loading || !contact.trim()}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Searching</span>
              </>
            ) : (
              'Find Orders'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl mb-8 flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {!loading && searched && orders.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Orders Found</h3>
          <p className="text-slate-500">We couldn't find any orders linked to this number.</p>
        </div>
      )}

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-bold text-slate-900">Order #{order.id}</h2>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700">{config.currency.symbol} {parseInt(order.total).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items?.map((it, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 mt-0.5">
                            {it.quantity}x
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 line-clamp-1">{it.title}</p>
                            <p className="text-xs text-slate-500">{config.currency.symbol} {it.price}</p>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-700">
                          {config.currency.symbol} {it.quantity * it.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Delivery Details</h3>
                  <div className="flex items-start gap-3 mb-2">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <div>
                      <p className="text-sm text-slate-700">{order.shippingAddress}</p>
                      <p className="text-sm text-slate-500">{order.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button
                  onClick={() => router.push(`/track-order/${order.id}`)}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Track Order Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
