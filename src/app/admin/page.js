"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import AdminOverview from '../../components/Admin/AdminOverview';
import AdminProducts from '../../components/Admin/AdminProducts';
import AdminOrders from '../../components/Admin/AdminOrders.optimized'; // Using optimized version if available
import AdminLogin from '../../components/Admin/AdminLogin';

export default function AdminPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    // Check if token exists in localStorage as fallback or clear it
                    const token = localStorage.getItem('adminToken');
                    if (token) {
                        // If token exists but /api/auth/me failed, it might be expired
                        localStorage.removeItem('adminToken');
                    }
                }
            } catch (err) {
                console.error('Auth check error:', err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = (token, userData) => {
        localStorage.setItem('adminToken', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    if (loading) return null;

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard': return <AdminOverview user={user} onChangeSection={setCurrentSection} />;
            case 'products': return <AdminProducts user={user} />;
            case 'orders': return <AdminOrders user={user} />;
            default: return <AdminOverview user={user} onChangeSection={setCurrentSection} />;
        }
    };

    return (
        <AdminLayout user={user} section={currentSection} onSectionChange={setCurrentSection}>
            {renderSection()}
        </AdminLayout>
    );
}
