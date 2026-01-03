import { fetchProductFn } from '../../../../hooks/useProductQuery';
import ProductDetailClient from '../../../../components/ProductDetail/ProductDetailClient';
import config from '../../../../config';

// Server-side fetch for metadata
async function getProduct(slug) {
    try {
        const base = config.api.baseUrl.replace(/\/$/, '');
        const res = await fetch(`${base}/api/products/${slug}`);
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        console.error("Failed to fetch product for metadata", e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params; // Next.js 15: params is promise
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        };
    }

    const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${config.api.baseUrl}${product.image}`) : `${config.api.baseUrl}/og-image.jpg`;

    return {
        title: `${product.title} | ${config.appName}`,
        description: product.description?.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description?.substring(0, 160),
            url: `${config.api.baseUrl}/product/${slug}`,
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.title,
                },
            ],
        },
    };
}

// Enable ISR: Revalidate product page every hour (3600 seconds)
export const revalidate = 3600;

export default async function ProductPage({ params }) {
    const { slug } = await params;

    // ⚡ Performance: Fetch on server for instant hydration
    const product = await getProduct(slug);

    return <ProductDetailClient slug={slug} initialProduct={product} />;
}
