/**
 * Global Configuration for CoolCache E-commerce Platform
 * Change values here to update the entire application.
 */

const config = {
    // Branding
    appName: "CoolCache",
    appShortName: "CoolCache", // Used in mobile view or small spaces
    // Signature: base64(Hadeed Hussain Memon)
    _sig: "SGFkZWVkIEh1c3NhaW4gTWVtb24=",
    tagline: "Curating The Modern Lifestyle",
    description: "Boutique fashion and minimalist lifestyle pieces for the discerning modern observer.",

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
    // Note: Internal routing now uses relative paths or direct DB access (Next.js 15)
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "", 
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
        primaryColor: "#000000", // Black
        accentColor: "#f3f4f6",  // Gray-100
        borderRadius: "0px"      // Sharp edges for fashion aesthetic
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
