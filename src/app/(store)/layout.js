import React, { Suspense } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import BottomNav from '../../components/BottomNav/BottomNav';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton';
import PushPrompt from '../../components/Notifications/PushPrompt';

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
