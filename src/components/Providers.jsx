"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import store from "../store/store";
import { CartProvider } from "../context/CartContext.jsx"; // Ensure extension match
import { WishlistProvider } from "../context/WishlistContext.jsx";
import { Toaster } from "sonner";
import { CartAnimationProvider } from "../context/CartAnimationContext";
import FlyToCartAnimation from "./UI/FlyToCartAnimation";
import { motion } from "framer-motion";
import TopProgressBar from "./UI/TopProgressBar";

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
                            <motion.div
                                initial={{ opacity: 0, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            >
                                {children}
                            </motion.div>
                            <FlyToCartAnimation />
                        </CartAnimationProvider>
                        <Toaster position="bottom-right" richColors />
                    </WishlistProvider>
                </CartProvider>
            </QueryClientProvider>
        </Provider>
    );
}
