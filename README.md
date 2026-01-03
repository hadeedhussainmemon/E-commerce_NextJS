# 🛍️ Next.js E-Commerce Template (Premium)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.0-FF4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query/latest)
[![PWA](https://img.shields.io/badge/PWA-Ready-006400?style=for-the-badge&logo=progressive-web-apps)](https://web.dev/progressive-web-apps/)

A high-performance, **premium-themed** e-commerce template built for modern retailers. Designed for lightning-fast speeds, high conversion rates, and seamless mobile experiences.

---

## ✨ Premium Features

### 🎨 Visual Excellence
- **Modern Vibrant Design**: A sophisticated Slate & Emerald color palette.
- **Glassmorphism UI**: High-end translucent navigation and containers.
- **Premium Hero**: Dynamic video/image sliders with abstract glow effects.
- **Custom 404 & Empty States**: Every corner of the app is branded and polished.

### 🚀 Optimized UX
- **Blazing Speed**: Server-side rendering (SSR) for instant first-paint.
- **Smart Cart**: Integrated "Free Shipping" progress tracker and coupon validation.
- **Sticky Mobile Buy Bar**: A conversion-optimized floating bar for smaller screens.
- **Skeleton Loading**: Smooth transitions with multi-layer skeleton systems.
- **Track & Order**: Real-time order tracking with visual journey maps.

### 🛡️ Built-in Tools
- **Deep Search**: Full-text search with debouncing and instant suggestions.
- **Product Reviews**: Native review system (ready for backend integration).
- **Admin Dashboard**: Comprehensive orders, products, and analytics management.
- **SEO Ready**: Dynamic meta tags, Open Graph (OG) support, and structured data.

---

## 🛠️ Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/hadeedhussainmemon/E-commerce-Store.git

# Enter directory
cd E-commerce-Store

# Install dependencies
npm install
```

### 2. Configuration
The entire app is managed via `src/config.js`. You can easily swap:
- **Branding**: App name, logo paths, and taglines.
- **Socials**: WhatsApp, Instagram, and support links.
- **Currency**: Symbol, code, and region-specific formatting.

### 3. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 4. Run Development
```bash
npm run dev
```

---

## ⚙️ Customization Guide

### Theme Overrides
Modify the brand identity in `tailwind.config.js` or via the centralized configuration:
- **Primary Color**: Update `emerald-600` for the brand identity.
- **Backgrounds**: Slate-900 is used for the "Dark Mode" premium feel.

### Adding Products
Use the built-in seeding script to populate your store instantly:
```bash
node scripts/seed-products.js
```

---

## 📦 Deployment
Optimized for **Vercel** with one-click deployment support. 
1. Connect your GitHub repo.
2. Set `NEXT_PUBLIC_API_BASE_URL`.
3. Deploy!

---

*Developed with premium precision by **CoolCache Team***.  
*For support or customization, reach out via GitHub issues.*
