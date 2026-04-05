import config from '@/config';

export default function sitemap() {
    const baseUrl = config.api.baseUrl; // Dynamically use the configured base URL

    const routes = [
        '',
        '/about-us',
        '/categories',
        '/cart',
        '/wishlist',
        '/my-orders',
        '/track-order',
        '/new-arrivals',
        '/recommendations',
        '/search',
        '/contact-us',
        '/faq',
        '/privacy-policy',
        '/terms-of-service',
        '/shipping-policy',
        '/returns',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    return routes;
}
