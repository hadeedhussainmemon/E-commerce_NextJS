import { getCategories } from "@/lib/data";
import CategoryGrid from "@/components/store/Category/CategoryGrid";

/**
 * Server Component: Suspenseful Category Grid
 * Fetches data on the server with 'use cache' and renders the client grid.
 */
export default async function SuspensefulCategoryGrid() {
  const categoriesData = await getCategories();
  
  return <CategoryGrid categoriesFromSSR={categoriesData} />;
}

export function CategoryGridSkeleton() {
  return (
    <div className="py-24 bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-24 w-1/3 bg-slate-50 mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-12 py-20 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 mb-10" />
              <div className="h-4 w-24 bg-slate-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
