/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Security: Hide Next.js header
  images: {
    formats: ['image/avif', 'image/webp'], // Enable next-gen formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Optimize for different screens
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'coolcache.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  reactCompiler: true,
  cacheComponents: true, // Required for 'use cache' directives in lib/data.js
};

export default nextConfig;
