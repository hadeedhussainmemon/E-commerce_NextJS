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

const AdminLayout = ({ children, section = 'dashboard', onSectionChange }) => {
  const [currentSection, setCurrentSection] = useState(section);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col lg:flex-row relative selection:bg-emerald-500/30">
      {/* Real-time Sales Ticker (God-Tier Feed) */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-slate-900 border-b border-white/5 flex items-center px-4 overflow-hidden md:h-8">
        <div className="flex items-center gap-4 animate-scroll-rtl whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-emerald-400/60">
          <span>⚡ Real-time Stream Active</span>
          <span className="text-slate-700">•</span>
          <span>New Order #4021 Received 2m ago</span>
          <span className="text-slate-700">•</span>
          <span>Silver Watch Stock Low</span>
          <span className="text-slate-700">•</span>
          <span>Search Spike: "Gold Ring"</span>
        </div>
      </div>
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-700 text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">CoolCache</h1>
            <p className="text-[10px] text-emerald-400 leading-none">Admin Panel</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Mobile Sidebar Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 shadow-2xl lg:shadow-none pt-8
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-6 py-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">CoolCache</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Admin Dashboard</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
          <SidebarLink
            active={currentSection === 'dashboard'}
            onClick={() => handleSectionChange('dashboard')}
            icon={BarChart3}
          >
            Dashboard
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'products'}
            onClick={() => handleSectionChange('products')}
            icon={Package}
          >
            All Products
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'orders'}
            onClick={() => handleSectionChange('orders')}
            icon={ShoppingCart}
          >
            Orders
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'notifications'}
            onClick={() => handleSectionChange('notifications')}
            icon={Bell}
          >
            Notifications
          </SidebarLink>
          <SidebarLink
            active={currentSection === 'coupons'}
            onClick={() => handleSectionChange('coupons')}
            icon={Ticket}
          >
            Coupons
          </SidebarLink>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-900/20 hover:text-rose-400 transition-all font-semibold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <div className="mt-4 px-4 text-xs text-slate-600 text-center font-mono">v1.3.0 (Emerald)</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden bg-[#020617] relative">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 pt-8 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
