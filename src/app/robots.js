export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        sitemap: 'https://vanguard-store.com/sitemap.xml', // Update with your actual domain
    };
}
