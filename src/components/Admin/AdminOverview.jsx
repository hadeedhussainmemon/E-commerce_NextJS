import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { TrendingUp, ShoppingBag, AlertTriangle, ArrowRight } from 'lucide-react';
import getImageUrl from '../../utils/imageUrl';
import SalesChart from './SalesChart';
import config from '../../config';

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-slate-900/60 transition-all duration-500">
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} className="text-white" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
            <p className="text-3xl font-black text-white italic tracking-tight">{value}</p>
        </div>

        {/* Decorative background glow */}
        <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.1] blur-3xl transition-opacity duration-1000`}></div>
    </div>
);

export default function AdminOverview({ onChangeSection, user }) {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProfit: 0,
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
        lowStockCount: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                // Fetch Summary Stats
                const statsRes = await fetch(`/api/orders/stats/summary`, { headers });
                const statsData = statsRes.ok ? await statsRes.json() : null;

                // Fetch Recent Orders
                const ordersRes = await fetch(`/api/orders?page=1&pageSize=5`, { headers });
                const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
                const orders = ordersData.orders || [];

                // Fetch Products for stock alerts
                const prodRes = await fetch(`/api/products?pageSize=1000&showHidden=true`, { headers });
                const prodData = prodRes.ok ? await prodRes.json() : { products: [] };
                const products = Array.isArray(prodData) ? prodData : prodData.products || [];

                // Process Data
                const lowStock = products.filter(p => p.stock < 10 && p.stock > 0);
                const chartData = statsData?.monthlySales || [];

                setStats({
                    totalRevenue: statsData?.totalRevenue || 0,
                    totalProfit: statsData?.totalProfit || 0,
                    totalOrders: statsData?.total || 0,
                    pendingOrders: statsData?.pending || 0,
                    totalProducts: products.length,
                    lowStockCount: lowStock.length
                });

                setRecentOrders(orders.slice(0, 5));
                setLowStockProducts(lowStock.slice(0, 5));
                setChartData(chartData);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-playfair font-black text-white mb-2 italic">Command Center</h2>
                <p className="text-slate-400 font-medium tracking-wide">Performance Overview & Real-time Insights</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="Gross Revenue"
                    value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="from-emerald-500 to-teal-500"
                />
                <StatsCard
                    title="Net Profit"
                    value={`Rs. ${stats.totalProfit.toLocaleString()}`}
                    icon={TrendingUp}
                    color="from-indigo-500 to-blue-600"
                />
                <StatsCard
                    title="Active Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="from-amber-400 to-orange-600"
                />
                <StatsCard
                    title="Stock Alerts"
                    value={stats.lowStockCount}
                    icon={AlertTriangle}
                    color="from-rose-500 to-pink-600"
                />
            </div>

            {/* Monthly Sales Chart */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Economic Trajectory</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-lg tracking-widest border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Active Stream</span>
                    </div>
                </div>
                <SalesChart data={chartData.length > 0 ? chartData : []} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white italic tracking-tight">Recent Activity</h3>
                        <button onClick={() => onChangeSection('orders')} className="text-emerald-400 hover:text-emerald-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 group transition-all">
                            Stream View <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No recent temporal logs</p>
                            </div>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-white/[0.05] rounded-3xl border border-white/5 transition-all group cursor-pointer hover:border-emerald-500/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all border border-white/5">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-sm tracking-tight">#ORD-{order.id.slice(-4).toUpperCase()}</div>
                                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.15em] mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-emerald-400 text-base tracking-tighter mb-1">Rs. {order.total.toLocaleString()}</div>
                                        <span className={`text-[8px] px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em] shadow-sm ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                'bg-slate-800 text-slate-500 border border-white/5'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white italic tracking-tight">Stock Warnings</h3>
                        <button onClick={() => onChangeSection('products')} className="text-emerald-400 hover:text-emerald-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 group transition-all">
                            Restock Hub <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {lowStockProducts.length === 0 ? (
                            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl group overflow-hidden relative">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl translate-y-10" />
                                <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest relative z-10">Inventory integrity 100%</p>
                            </div>
                        ) : (
                            lowStockProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-5 p-5 bg-rose-500/[0.02] border border-rose-500/10 rounded-3xl group hover:bg-rose-500/[0.05] transition-all hover:border-rose-500/30">
                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex-shrink-0 p-2 border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={getImageUrl(product.image, { width: 100, crop: 'fill' })}
                                                alt={product.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-white text-sm truncate tracking-tight">{product.title}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]" style={{ width: `${(product.stock / 10) * 100}%` }} />
                                            </div>
                                            <p className="text-[9px] text-rose-500 font-black uppercase tracking-[0.15em]">{product.stock} Units</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
