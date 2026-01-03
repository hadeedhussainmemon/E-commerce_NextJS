/**
 * Global Configuration for HH Store Template (Next.js Version)
 * Change values here to update the entire application.
 */

const config = {
    // Branding
    appName: "HH Store",
    appShortName: "HH Store", // Used in mobile view or small spaces
    tagline: "Premium Neutral E-commerce Template",
    description: "A neutral, customizable e-commerce template ready for your API.",

    // SEO & Socials
    socials: {
        instagram: "hadeedhussainmemon",
        facebook: "hadeedhussainmemon",
        twitter: "@hadeedhussain",
        contactEmail: "programmerhadeed@gmail.com",
        contactPhone: "+92 332 2965814",
        whatsapp: "+92 332 2965814"
    },

    // API Configuration
    // Note: These use NEXT_PUBLIC_ prefix for client-side availability
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commerce-next-js-xi-cyan.vercel.app/",
        endpoints: {
            products: "/api/products",
            categories: "/api/products/categories",
            orders: "/api/orders",
            upload: "/api/upload"
        }
    },

    // Localization & Currency
    currency: {
        symbol: "Rs.",
        code: "PKR",
        locale: "en-PK"
    },

    // Theme & UI Defaults
    theme: {
        primaryColor: "#0f172a", // Slate-900
        accentColor: "#10b981",  // Emerald-500
        borderRadius: "0.5rem"
    },

    // Feature Flags
    features: {
        enableWishlist: true,
        enableReviews: true,
        enablePWA: true,
        enableBlog: false
    }
};

export default config;
