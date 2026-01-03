import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import config from '../../config';
import { formatOrderConfirmationMessage, formatOrderThankYouMessage } from '../../utils/orderMessages';

import getImageUrl from '../../utils/imageUrl';

// Memoized status color utility
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };
  return colors[status] || 'bg-slate-800 text-slate-400 border-white/5';
};

// Memoized date formatter
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Memoized Stats Card Component
const StatsCard = React.memo(({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-slate-900/60 transition-all duration-500">
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-white italic tracking-tight">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl transition-opacity`}></div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// Memoized Order Item Component with improved image tag (skeleton, lazy load, accessible)
// Memoized Order Item Component with improved image tag (skeleton, lazy load, accessible)
const OrderItem = React.memo(({ item }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const src = getImageUrl(item.image);

  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group">
      <div className="relative w-14 h-14 bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden border border-white/5 transition-transform group-hover:scale-105">
        <Image
          src={src}
          alt={item.title || 'Product'}
          fill
          className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{item.title}</p>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{item.quantity} × Rs. {item.price}</p>
      </div>
      <p className="font-black text-emerald-400 text-sm">Rs. {item.quantity * item.price}</p>
    </div>
  );
});

OrderItem.displayName = 'OrderItem';

// Memoized Order Card Component
const OrderCard = React.memo(({
  order,
  onStatusUpdate,
  onPaymentUpdate,
  onDelete,
  onCopyConfirmation,
  onCopyThankYou
}) => (
  <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl hover:bg-slate-900/60 transition-all duration-500">
    <div className="p-8">
      {/* Order Header */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-playfair font-black text-white italic tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h3>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{formatDate(order.createdAt)}</p>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>{order.paymentStatus === 'paid' ? 'Paid' : 'COD'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-white italic tracking-tight">Rs. {order.total}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{order.items.length} Units Manifested</p>
          </div>
        </div>
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-black mb-4 uppercase tracking-[0.2em]">Contact Node</p>
          <p className="font-bold text-white text-lg mb-1">{order.customerName}</p>
          <p className="text-sm text-emerald-400 font-bold font-mono">{order.customerPhone}</p>
          {order.customerEmail && <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">{order.customerEmail}</p>}
        </div>
        <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-black mb-4 uppercase tracking-[0.2em]">Deployment Address</p>
          <p className="text-sm text-slate-200 font-bold leading-relaxed">{order.shippingAddress}</p>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-3">{order.city} Vector</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <p className="text-[10px] text-slate-500 font-black mb-4 uppercase tracking-[0.2em] px-2">Manifest Items</p>
        <div className="space-y-1 bg-white/[0.01] p-2 rounded-3xl border border-white/5">
          {order.items.map((item, idx) => (
            <OrderItem key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-8 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
          <p className="text-[10px] text-emerald-400 font-black mb-2 uppercase tracking-widest italic">Manifest Annotation:</p>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
        <select
          value={order.status}
          onChange={(e) => onStatusUpdate(order.id, e.target.value)}
          className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer appearance-none"
        >
          <option value="pending" className="bg-slate-900">Pending</option>
          <option value="confirmed" className="bg-slate-900">Confirmed</option>
          <option value="processing" className="bg-slate-900">Processing</option>
          <option value="shipped" className="bg-slate-900">Shipped</option>
          <option value="delivered" className="bg-slate-900">Delivered</option>
          <option value="cancelled" className="bg-slate-900">Cancelled</option>
        </select>

        {order.paymentStatus === 'pending' && (
          <button
            onClick={() => onPaymentUpdate(order.id, 'paid')}
            className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5 active:scale-95"
          >
            Mark Paid
          </button>
        )}

        <button
          onClick={() => onCopyConfirmation(order)}
          className="px-6 py-3 bg-white/[0.02] border border-white/5 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#020617] transition-all active:scale-95"
          title="Personalized Confirmation"
        >
          Manifest
        </button>

        <button
          onClick={() => onCopyThankYou(order)}
          className="px-6 py-3 bg-white/[0.02] border border-white/5 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#020617] transition-all active:scale-95"
          title="Gratitude Message"
        >
          Gratitude
        </button>

        <button
          onClick={() => onDelete(order.id)}
          className="ml-auto px-6 py-3 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95"
        >
          Terminate
        </button>
      </div>
    </div>
  </div>
));

OrderCard.displayName = 'OrderCard';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const API_BASE_URL = config.api.baseUrl;

  // IMAGE_BASE_URL is deprecated in favor of getImageUrl() utility

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? `${API_BASE_URL}/api/orders`
        : `${API_BASE_URL}/api/orders?status=${filter}`;
      // Attach admin auth header if available
      const token = localStorage.getItem('adminToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(url, { headers });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (response.status === 503) {
        setError('Service temporarily unavailable. Orders require the database.');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.orders || []); // API returns { orders: [], total: ... }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, filter]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(`${API_BASE_URL}/api/orders/stats/summary`, { headers });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (response.status === 503) {
        // Surface stats error silently but do not crash main UI
        setError('Service temporarily unavailable. Unable to load statistics.');
        return;
      }
      if (!response.ok) return;
      const data = await response.json();
      setStats(data);
    } catch (err) {
      // Silent fail for stats
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchOrders();
    // reset to first page when filter or query changes
    setPage(1);
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Filter and paginate orders client-side for nicer UX
  const filteredOrders = useMemo(() => {
    if (!query) return orders;
    const q = query.trim().toLowerCase();
    return orders.filter(o => {
      return String(o.id).includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').toLowerCase().includes(q) ||
        (o.customerEmail || '').toLowerCase().includes(q);
    });
  }, [orders, query]);

  const totalPages = Math.max(1, Math.ceil((filteredOrders?.length || 0) / perPage));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return (filteredOrders || []).slice(start, start + perPage);
  }, [filteredOrders, page, perPage]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      if (response.status === 503) {
        alert('Service temporarily unavailable. Order updates require the database.');
        return;
      }
      if (!response.ok) throw new Error('Failed to update order');

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      fetchStats();
    } catch (err) {
      alert('Error updating order: ' + err.message);
      fetchOrders();
    }
  }, [API_BASE_URL, fetchOrders, fetchStats]);

  const updatePaymentStatus = useCallback(async (orderId, paymentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ paymentStatus })
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      if (response.status === 503) {
        alert('Service temporarily unavailable. Payment updates require the database.');
        return;
      }
      if (!response.ok) throw new Error('Failed to update payment status');

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, paymentStatus } : order
        )
      );
      fetchStats();
    } catch (err) {
      alert('Error updating payment status: ' + err.message);
      fetchOrders();
    }
  }, [API_BASE_URL, fetchOrders, fetchStats]);

  const deleteOrder = useCallback(async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      if (response.status === 503) {
        alert('Service temporarily unavailable. Deleting orders requires the database.');
        return;
      }
      if (!response.ok) throw new Error('Failed to delete order');

      setOrders(prev => prev.filter(order => order.id !== orderId));
      fetchStats();
    } catch (err) {
      alert('Error deleting order: ' + err.message);
      fetchOrders();
    }
  }, [API_BASE_URL, fetchOrders, fetchStats]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch {
        return false;
      }
    }
  }, []);

  const handleCopyConfirmation = useCallback(async (order) => {
    const msg = formatOrderConfirmationMessage(order);
    const ok = await copyToClipboard(msg);
    alert(ok ? '✅ Confirmation message copied to clipboard!' : '❌ Failed to copy message');
  }, [copyToClipboard]);

  const handleCopyThankYou = useCallback(async (order) => {
    const msg = formatOrderThankYouMessage(order);
    const ok = await copyToClipboard(msg);
    alert(ok ? '✅ Thank-you message copied to clipboard!' : '❌ Failed to copy message');
  }, [copyToClipboard]);

  const statsIcons = useMemo(() => ({
    total: () => (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    pending: () => (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    delivered: () => (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
      </svg>
    ),
    revenue: () => (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }), []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="mt-6 text-lg font-semibold text-slate-700">Loading orders...</p>
        <p className="mt-2 text-sm text-slate-500">Please wait while we fetch your data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-rose-600 font-bold text-lg mb-2">Error Loading Orders</p>
          <p className="text-slate-600 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Volume" value={stats.total} icon={statsIcons.total} color="from-indigo-500 to-blue-600" />
          <StatsCard title="Active Signals" value={stats.pending} icon={statsIcons.pending} color="from-amber-400 to-orange-500" />
          <StatsCard title="Completed Flux" value={stats.delivered} icon={statsIcons.delivered} color="from-emerald-500 to-teal-600" />
          <StatsCard title="Gross Extraction" value={`Rs. ${stats.totalRevenue}`} icon={statsIcons.revenue} color="from-cyan-400 to-blue-500" />
        </div>
      )}

      {/* Filters */}
      {/* Filters Hub */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => { setFilter(status); setPage(1); }}
                className={`px-6 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all border ${filter === status
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'bg-white/[0.02] text-slate-500 border-white/5 hover:bg-white/[0.04] hover:text-slate-300'
                  }`}
              >
                {status}
                {stats && status !== 'all' && <span className="ml-2 bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-500/50">{stats[status]}</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-2.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Density</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
            >
              <option value={8} className="bg-slate-900">08 Units</option>
              <option value={12} className="bg-slate-900">12 Units</option>
              <option value={20} className="bg-slate-900">20 Units</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-20 text-center shadow-2xl">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white italic mb-3">No Signals Detected</h3>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Awaiting customer interaction data</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={updateOrderStatus}
              onPaymentUpdate={updatePaymentStatus}
              onDelete={deleteOrder}
              onCopyConfirmation={handleCopyConfirmation}
              onCopyThankYou={handleCopyThankYou}
            />
          ))}
        </div>
      )}

      {/* Pagination - Only show in Grid Mode */}
      {/* Pagination */}
      {/* Pagination Container */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl gap-6">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-4">Entity {page * perPage - perPage + 1} to {Math.min(page * perPage, filteredOrders.length)} of {filteredOrders.length} Manifested</div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-8 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-white hover:text-[#020617] disabled:opacity-10 transition-all active:scale-95"
          >
            ← Recall
          </button>
          <div className="text-base font-black text-white italic tracking-tight">Stage {page} <span className="text-slate-500 font-normal mx-2">/</span> {totalPages}</div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-8 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-white hover:text-[#020617] disabled:opacity-10 transition-all active:scale-95"
          >
            Advance →
          </button>
        </div>
      </div>
    </div >
  );
}

