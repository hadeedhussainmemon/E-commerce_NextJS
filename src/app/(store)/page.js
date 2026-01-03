
import HomeClient from '../../components/Home/HomeClient';
import config from '../../config';

// ⚡ Enable ISR: Revalidate page every 60 seconds
export const revalidate = 60;

export const metadata = {
    title: `Home | ${config.appName}`,
    description: config.description,
};

import { getProducts, getCategories } from '@/lib/data';

async function getData() {
    try {
        // Parallel Fetch for Performance using direct DB calls
        const [productsData, categoriesData] = await Promise.all([
            getProducts({ limit: 24, sort: 'featured' }),
            getCategories()
        ]);

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
