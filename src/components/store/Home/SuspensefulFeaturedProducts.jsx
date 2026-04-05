import { getProducts } from "@/lib/data";
import ProductCard from "@/components/store/ProductCard/ProductCard";
import { motion } from "framer-motion";

/**
 * Server Component: Suspenseful Featured Products
 * Fetches data on the server with 'use cache' for high performance.
 */
export default async function SuspensefulFeaturedProducts() {
  const { products } = await getProducts({ limit: 8, sort: "featured" });

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
      {products.map((p, i) => (
        <ProductCard key={p.id || i} product={p} />
      ))}
    </div>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-6">
          <div className="aspect-[3/4] bg-slate-50 rounded-sm" />
          <div className="h-4 bg-slate-100 w-2/3" />
          <div className="h-4 bg-slate-50 w-1/3" />
        </div>
      ))}
    </div>
  );
}
