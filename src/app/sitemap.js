export default function sitemap() {
    const baseUrl = 'https://petal-plus-pup.vercel.app'; // Update with your actual domain

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
