import React, { useState, useEffect } from 'react';
import { BarChart3, ShoppingCart, Package, Menu, X, LogOut, Bell, Ticket } from 'lucide-react';

const SidebarLink = ({ children, onClick, active, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all duration-300 group ${active
      ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20'
      : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent'
      }`}
  >
    <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-emerald-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
      {Icon && <Icon size={18} className={active ? 'text-emerald-400' : 'text-slate-400'} />}
    </div>
    {children}
  </button>
);

const AdminLayout = ({ children, section = 'dashboard', onSectionChange, user }) => {
  const [currentSection, setCurrentSection] = useState(section);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const displayName = user?.businessName || user?.name || 'Petal + Pup';
  const roleLabel = user?.role === 'superadmin' ? 'OS Matrix' : 'Merchant Protocol';

  // Remove body padding for admin panel
  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  const handleSectionChange = (newSection) => {
    setCurrentSection(newSection);
    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
    if (onSectionChange) {
      onSectionChange(newSection);
    }
  };

  const handleLogout = () => {
    if (confirm('Initiate termination of current session?')) {
      localStorage.removeItem('adminToken');
      document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col lg:flex-row relative selection:bg-emerald-500/30 font-inter">
      {/* Real-time Sales Ticker (God-Tier Feed) */}
      <div className="fixed top-0 left-0 right-0 h-10 z-[60] bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center px-6 overflow-hidden">
        <div className="flex items-center gap-6 animate-scroll-rtl whitespace-nowrap text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Phase 1 Network Active</span>
          <span className="text-slate-700">|</span>
          <span>Transmission #4902 Received: Order Confirmed</span>
          <span className="text-slate-700">|</span>
          <span>Buffer Alert: Chronograph 40mm Stock {`<`} 5 Units</span>
          <span className="text-slate-700">|</span>
          <span>Global Search Pulse: "Obsidian" Velocity 1.8x</span>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 text-white p-5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all active:scale-90"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-playfair font-black text-white italic tracking-tight">{displayName}</h1>
            <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em] leading-none mt-1">{roleLabel}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl transition-all active:scale-95">
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Sidebar Drawer Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-80 bg-slate-950/60 backdrop-blur-[40px] border-r border-white/10 flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)] lg:shadow-none pt-10
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-8 py-8 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-playfair font-black text-white italic tracking-tighter">{displayName}</h2>
            <p className="text-[10px] text-emerald-500/60 mt-1 uppercase tracking-[0.3em] font-black">{roleLabel}</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 mt-6">Command Matrix</p>
          <SidebarLink
            active={currentSection === 'dashboard'}
            onClick={() => handleSectionChange('dashboard')}
            icon={BarChart3}
          >
            Tactical Overview
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'products'}
            onClick={() => handleSectionChange('products')}
            icon={Package}
          >
            Inventory Hub
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'orders'}
            onClick={() => handleSectionChange('orders')}
            icon={ShoppingCart}
          >
            Order Nexus
          </SidebarLink>

          <p className="px-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 mt-12">Protocol Segments</p>
          <SidebarLink
            active={currentSection === 'notifications'}
            onClick={() => handleSectionChange('notifications')}
            icon={Bell}
          >
            Alert Matrix
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'coupons'}
            onClick={() => handleSectionChange('coupons')}
            icon={Ticket}
          >
            Voucher Forge
          </SidebarLink>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
          >
            <LogOut size={18} />
            <span>Terminate session</span>
          </button>
          <div className="mt-6 px-6 text-[8px] text-slate-800 text-center font-black uppercase tracking-[0.4em]">v1.4.2 // EMERALD CORE</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 lg:p-16 overflow-x-hidden bg-[#020617] relative pt-20 lg:pt-24">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

import { motion, AnimatePresence } from 'framer-motion';

export default AdminLayout;
