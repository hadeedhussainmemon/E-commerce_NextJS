"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import store from "../store/store";
import { CartProvider } from "../context/CartContext.jsx"; // Ensure extension match
import { WishlistProvider } from "../context/WishlistContext.jsx";
import { Toaster } from "sonner";
import { CartAnimationProvider } from "../context/CartAnimationContext";
import FlyToCartAnimation from "./UI/FlyToCartAnimation";

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
                            {children}
                            <FlyToCartAnimation />
                        </CartAnimationProvider>
                        <Toaster position="bottom-right" richColors />
                    </WishlistProvider>
                </CartProvider>
            </QueryClientProvider>
        </Provider>
    );
}
