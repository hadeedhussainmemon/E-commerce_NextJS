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

export default function AdminOverview({ onChangeSection }) {
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
    const [chartData, setChartData] = useState([]); // New chart data state
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = config.api.baseUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                // Fetch Orders (for stats & recent)
                // Note: In a real app, use dedicated stats endpoints. Here we fetch all/recent lists if needed or mock aggregation if endpoints missing.
                // Re-using the summary endpoint seen in AdminOrders
                const statsRes = await fetch(`${API_BASE_URL}/api/orders/stats/summary`, { headers });
                const statsData = statsRes.ok ? await statsRes.json() : null;

                // Fetch Recent Orders (First page)
                const ordersRes = await fetch(`${API_BASE_URL}/api/orders?page=1&pageSize=5`, { headers });
                const ordersData = ordersRes.ok ? await ordersRes.json() : [];

                // Fetch Products (for stock)
                const prodRes = await fetch(`${API_BASE_URL}/api/products?pageSize=1000`);
                const prodData = prodRes.ok ? await prodRes.json() : [];
                const products = Array.isArray(prodData) ? prodData : prodData.products || [];

                // Process Data
                // Update process data logic
                const lowStock = products.filter(p => p.stock < 5 && p.stock > 0);

                // Sort monthly sales properly by month index if needed, or rely on backend
                const chartData = statsData?.monthlySales || [];

                setStats({
                    totalRevenue: statsData?.totalRevenue || 0,
                    totalProfit: statsData?.totalProfit || 0, // New field
                    totalOrders: statsData?.total || 0, // Count of all non-cancelled orders
                    pendingOrders: statsData?.pending || 0,
                    totalProducts: products.length,
                    lowStockCount: lowStock.length
                });

                setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
                setLowStockProducts(lowStock.slice(0, 5));
                setChartData(chartData); // Need state for this
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_BASE_URL]);

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
                    <h3 className="text-xl font-black text-white italic tracking-tight">Growth Projection</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20">Monthly</span>
                    </div>
                </div>
                <SalesChart data={chartData.length > 0 ? chartData : [{ name: 'No Data', value: 0 }]} />
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
                            <p className="text-gray-500 text-center py-4">No recent orders.</p>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl border border-white/5 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">#ORD-{order.id.slice(-4).toUpperCase()}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-white text-sm mb-1">Rs. {order.total}</div>
                                        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                'bg-slate-800 text-slate-400 border border-white/5'
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
                            <div className="text-center py-8 text-green-600 bg-green-50 rounded-xl">
                                <p className="font-medium">All items are well stocked! 🎉</p>
                            </div>
                        ) : (
                            lowStockProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl group hover:bg-rose-500/10 transition-all">
                                    <div className="w-14 h-14 bg-slate-800 rounded-xl flex-shrink-0 p-2 border border-white/5">
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
                                        <p className="font-bold text-white truncate">{product.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-rose-500" style={{ width: `${(product.stock / 10) * 100}%` }} />
                                            </div>
                                            <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">{product.stock} Left</p>
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
