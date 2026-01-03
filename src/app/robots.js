export default function robots() {
    const baseUrl = 'https://www.coolcache.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin/*',
                    '/checkout',
                    '/checkout/*',
                    '/order-success',
                    '/api/',
                    '/*?*utm_source=',
                    '/*?*session_id=',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: ['/', '/category/*', '/product/*', '/categories', '/faq'],
                disallow: ['/admin/*', '/checkout/*'],
                // crawlDelay: 0, // Next.js doesn't support crawlDelay directly in type, but it handles standard rules
            },
            {
                userAgent: 'Googlebot-Image',
                allow: ['/', '/images/*'],
            },
            {
                userAgent: 'Bingbot',
                allow: ['/', '/category/*', '/product/*'],
                disallow: ['/admin/*', '/checkout/*'],
            },
            {
                userAgent: ['facebookexternalbot', 'Twitterbot', 'WhatsApp', 'OAI-SearchBot'],
                allow: ['/', '/product/*', '/category/*'],
            },
            {
                userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
                disallow: ['/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
