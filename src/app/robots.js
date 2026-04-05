import config from '@/config';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        sitemap: `${config.api.baseUrl}/sitemap.xml`, // Update with your actual domain
    };
}
