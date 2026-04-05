"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import store from "@/store/store";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import { CartAnimationProvider } from "@/context/CartAnimationContext";
import FlyToCartAnimation from "@/components/common/UI/FlyToCartAnimation";
import { motion } from "framer-motion";
import TopProgressBar from "@/components/common/UI/TopProgressBar";
import Cart from "@/components/store/Cart/Cart";
import MobileBottomNav from "@/components/common/UI/MobileBottomNav";

function ProvidersContent({ children }) {
    const pathname = usePathname();
    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            {children}
        </motion.div>
    );
}

export default function Providers({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <CartProvider>
                    <WishlistProvider>
                        <CartAnimationProvider>
                            <Suspense fallback={null}>
                                <TopProgressBar />
                            </Suspense>
                            <Suspense fallback={null}>
                                <ProvidersContent>
                                    {children}
                                </ProvidersContent>
                            </Suspense>
                            <FlyToCartAnimation />
                            <Cart />
                            <Suspense fallback={null}>
                                <MobileBottomNav />
                            </Suspense>
                        </CartAnimationProvider>
                        <Toaster position="bottom-right" richColors />
                    </WishlistProvider>
                </CartProvider>
            </QueryClientProvider>
        </Provider>
    );
}
