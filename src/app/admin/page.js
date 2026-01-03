"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import AdminOverview from '../../components/Admin/AdminOverview';
import AdminProducts from '../../components/Admin/AdminProducts';
import AdminOrders from '../../components/Admin/AdminOrders.optimized'; // Using optimized version if available
import AdminLogin from '../../components/Admin/AdminLogin';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple mock auth check for now - replace with context or real auth
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAuthenticated(true);
    };

    if (loading) return null;

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard': return <AdminOverview onChangeSection={setCurrentSection} />;
            case 'products': return <AdminProducts />;
            case 'orders': return <AdminOrders />;
            default: return <AdminOverview onChangeSection={setCurrentSection} />;
        }
    };

    return (
        <AdminLayout section={currentSection} onSectionChange={setCurrentSection}>
            {renderSection()}
        </AdminLayout>
    );
}
