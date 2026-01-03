"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import store from "../store/store";
import { CartProvider } from "../context/CartContext.jsx"; // Ensure extension match
import { WishlistProvider } from "../context/WishlistContext.jsx";
import { Toaster } from "sonner";
import { CartAnimationProvider } from "../context/CartAnimationContext";
import FlyToCartAnimation from "./UI/FlyToCartAnimation";
import { motion } from "framer-motion";
import TopProgressBar from "./UI/TopProgressBar";
import Cart from "./Cart/Cart";

export default function Providers({ children }) {
    const pathname = usePathname();
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
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -2 }}
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {children}
                            </motion.div>
                            <FlyToCartAnimation />
                            <Cart />
                        </CartAnimationProvider>
                        <Toaster position="bottom-right" richColors />
                    </WishlistProvider>
                </CartProvider>
            </QueryClientProvider>
        </Provider>
    );
}
