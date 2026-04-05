import { getProduct } from '@/lib/data';
import ProductDetailClient from '@/components/store/ProductDetail/ProductDetailClient';
import config from '@/config';

/**
 * Server Component: Product Page
 * Uses direct DB access for instant hydration and SEO.
 */
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        };
    }

    const imageUrl = product.image 
        ? (product.image.startsWith('http') ? product.image : `${config.api.baseUrl}${product.image}`) 
        : `${config.api.baseUrl}/og-image.jpg`;

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
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
        },
    };
}



export default async function ProductPage({ params }) {
    const { slug } = await params;

    // ⚡ Direct DB Access (No internal fetch overhead)
    const product = await getProduct(slug);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="font-fashion-serif text-6xl italic font-black text-black mb-6">404</h1>
                    <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Piece Not Found</p>
                </div>
            </div>
        );
    }

    return <ProductDetailClient slug={slug} initialProduct={product} />;
}
