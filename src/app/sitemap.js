import config from '../config';

export default async function sitemap() {
    const baseUrl = 'https://www.coolcache.app'; // Or strict config.api.baseUrl if it matches frontend
    const apiBase = config.api.baseUrl;

    // Static routes
    const routes = [
        '',
        '/categories',
        '/wishlist',
        '/cart',
        // '/reviews', // If these pages exist
        // '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,
    }));

    try {
        // Fetch categories
        const categoriesRes = await fetch(`${apiBase}/api/products/categories`);
        const categoriesData = await categoriesRes.json();
        const categories = categoriesData.categories || [];

        const categoryUrls = categories.map((cat) => ({
            url: `${baseUrl}/category/${cat.name ? encodeURIComponent(cat.name) : ''}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        }));

        // Fetch products
        // Note: Fetching all products might be heavy. Ideally paginate or use a specialized sitemap endpoint.
        // For now, we fetch the first 100 or so, assuming the API supports a limit.
        const productsRes = await fetch(`${apiBase}/api/products?page=1&pageSize=1000`);
        const productsData = await productsRes.json();
        const products = productsData.products || [];

        const productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug || product.id}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.9,
        }));

        return [...routes, ...categoryUrls, ...productUrls];

    } catch (error) {
        console.error('Failed to generate sitemap:', error);
        return routes;
    }
}
