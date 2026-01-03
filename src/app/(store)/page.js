
import HomeClient from '../../components/Home/HomeClient';
import config from '../../config';

// ⚡ Enable ISR: Revalidate page every 60 seconds
export const revalidate = 60;

export const metadata = {
    title: `Home | ${config.appName}`,
    description: config.description,
};

async function getData() {
    try {
        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

        // Parallel Fetch for Performance
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${base}/api/products?limit=24&sort=featured`, { next: { revalidate: 60 } }),
            fetch(`${base}/api/products/categories`, { next: { revalidate: 3600 } })
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
            console.error('Failed to fetch initial data');
            return { productsData: null, categoriesData: null };
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        return { productsData, categoriesData };
    } catch (e) {
        console.error('SSR Error:', e);
        return { productsData: null, categoriesData: null };
    }
}

export default async function HomePage() {
    const { productsData, categoriesData } = await getData();

    return <HomeClient initialProducts={productsData} initialCategories={categoriesData} />;
}
