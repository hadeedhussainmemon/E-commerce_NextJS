import React, { Suspense } from 'react';
import Navbar from '@/components/common/Navbar/Navbar';
import Footer from '@/components/common/Footer/Footer';
import BottomNav from '@/components/store/BottomNav/BottomNav';
import WhatsAppButton from '@/components/store/WhatsAppButton/WhatsAppButton';
import PushPrompt from '@/components/store/Notifications/PushPrompt';

export default function StoreLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Suspense fallback={null}><Footer /></Suspense>
            <Suspense fallback={null}><BottomNav /></Suspense>
            <WhatsAppButton />
            <Suspense fallback={null}><PushPrompt /></Suspense>
        </>
    );
}
