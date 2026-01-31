export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        sitemap: 'https://petal-plus-pup.vercel.app/sitemap.xml', // Update with your actual domain
    };
}
