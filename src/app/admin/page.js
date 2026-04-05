import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { getAdminStats, getOrders, getProducts } from '@/lib/data';
import AdminClientShell from '@/components/admin/AdminClientShell';

/**
 * Server Component: Admin Dashboard
 * Fetches initial data directly from DB to avoid client-side waterfalls.
 */
export default async function AdminPage() {
    await dbConnect();

    // 1. Fetch initial data for the dashboard
    const [stats, ordersData, productsData] = await Promise.all([
        getAdminStats(),
        getOrders({ limit: 5, page: 1 }),
        getProducts({ limit: 1000, showHidden: true })
    ]);

    // 2. Identify products with low stock (< 10)
    const lowStockProducts = productsData.products.filter(p => p.stock < 10 && p.stock > 0);

    const initialData = {
        stats: {
            totalRevenue: stats.revenue,
            totalProfit: stats.revenue * 0.3, // Example calculation
            totalOrders: stats.totalOrders,
            pendingOrders: stats.pendingOrders,
            totalProducts: stats.totalProducts,
            lowStockCount: lowStockProducts.length
        },
        recentOrders: ordersData.orders,
        lowStockProducts: lowStockProducts.slice(0, 5)
    };

    return (
        <AdminClientShell initialData={initialData} />
    );
}
