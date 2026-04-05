"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  ChevronRight,
  LogOut,
  ExternalLink,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Categories', icon: Store, href: '/admin/categories' },
  { name: 'Customers', icon: Users, href: '/admin/customers' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminClientShell({ initialData, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const { stats, recentOrders, lowStockProducts } = initialData || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0A0A0A] border-r border-white/5 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Store size={22} className="text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                {config.appName.split(' ')[0]}<span className="text-emerald-500">{config.appName.split(' ')[1] || ''}</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-grow px-4 space-y-2 mt-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm tracking-wide uppercase font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Nav */}
          <div className="p-6 border-t border-white/5 space-y-4">
            <button className="flex items-center gap-4 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-colors group">
              <LogOut size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-24 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">
              Admin <span className="text-emerald-500">/</span> {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..."
                className="bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all w-64"
              />
            </div>
            <button className="relative p-2.5 text-gray-400 hover:text-white border border-white/5 rounded-xl hover:bg-white/5 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050505]"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs">AD</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto">
          {children || (
            <div className="space-y-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value={`Rs. ${stats?.totalRevenue?.toLocaleString()}`} trend="+12.5%" icon={TrendingUp} color="emerald" />
                <StatCard label="Total Orders" value={stats?.totalOrders} trend="+4" icon={ShoppingBag} color="blue" />
                <StatCard label="Active Products" value={stats?.totalProducts} trend="0" icon={Package} color="purple" />
                <StatCard label="Low Stock Items" value={stats?.lowStockCount} trend="Alert" icon={AlertTriangle} color="orange" isWarning={stats?.lowStockCount > 0} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Orders */}
                <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black italic uppercase tracking-tight">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-bold text-emerald-500 hover:underline uppercase tracking-widest flex items-center gap-2">
                        View All <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {recentOrders?.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                            <Clock size={20} className="text-gray-400 group-hover:text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase">#{order._id.slice(-8)}</p>
                            <p className="text-xs text-gray-500 font-medium">{order.customer?.name || "Guest Customer"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm">Rs. {order.totalAmount?.toLocaleString()}</p>
                          <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${
                            order.status === 'pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Low Stock Alerts */}
                <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black italic uppercase tracking-tight">Inventory Alerts</h2>
                    <AlertTriangle size={20} className="text-orange-500" />
                  </div>
                  <div className="space-y-6">
                    {lowStockProducts?.map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-4 rounded-3xl bg-orange-500/5 border border-orange-500/10 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/5">
                            <Package size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="font-bold text-sm truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-orange-400 font-black uppercase tracking-widest">{product.stock} units left</p>
                          </div>
                        </div>
                        <Link href={`/admin/products/${product._id}`} className="p-3 bg-white text-black rounded-xl hover:bg-emerald-500 transition-colors group-hover:scale-105 transform">
                            <ExternalLink size={16} />
                        </Link>
                      </div>
                    ))}
                    {(!lowStockProducts || lowStockProducts.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Store size={48} strokeWidth={1} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium italic">All inventory levels healthy.</p>
                        </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, isWarning }) {
  const colors = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className={`p-8 rounded-[2.5rem] bg-[#0A0A0A] border transition-all hover:scale-[1.02] duration-300 ${isWarning ? 'border-orange-500/50 shadow-lg shadow-orange-500/10' : 'border-white/5'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`text-xs font-black uppercase tracking-[0.2em] ${trend.startsWith('+') ? 'text-emerald-400' : 'text-gray-500'}`}>
          {trend}
        </div>
      </div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
    </div>
  );
}
