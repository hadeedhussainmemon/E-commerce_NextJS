import NewArrivals from "@/components/store/NewArrivals/NewArrivals";
import { getProducts } from "@/lib/data";

export const metadata = {
    title: "New Arrivals | Shop the Latest Trends",
    description: "Check out our latest collection of premium products. Fresh drops, limited editions, and the newest arrivals just for you.",
};

export default async function NewArrivalsPage() {
    // ⚡ Server-side fetch for the first page of new arrivals
    const { products: initialProducts, total: initialTotal } = await getProducts({
        sort: 'newest',
        limit: 20,
        page: 1
    });

    return <NewArrivals initialProducts={initialProducts} initialTotal={initialTotal} />;
}
