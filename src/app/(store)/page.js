import { Suspense } from 'react';
import HomeClient from '@/components/store/Home/HomeClient';
import config from '@/config';
import SuspensefulCategoryGrid, { CategoryGridSkeleton } from '@/components/store/Home/SuspensefulCategoryGrid';
import SuspensefulFeaturedProducts, { FeaturedProductsSkeleton } from '@/components/store/Home/SuspensefulFeaturedProducts';

export const metadata = {
    title: `Home | ${config.appName}`,
    description: config.description,
};

export default async function HomePage() {
    return (
        <div className="bg-white">
            <HomeClient>
                {/* 
                  Category Grid and Featured Products are streamed in via Suspense 
                  This implements Phase 3: Streaming/Suspense from our modernization plan.
                */}
                <section className="border-t border-gray-100">
                    <Suspense fallback={<CategoryGridSkeleton />}>
                        <SuspensefulCategoryGrid />
                    </Suspense>
                </section>

                <section id="featured-products" className="py-24 max-w-7xl mx-auto px-6 border-t border-gray-100">
                    <div className="max-w-xl mb-20">
                        <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-6 block">Our Collection</span>
                        <h2 className="font-fashion-serif text-5xl md:text-7xl italic font-black text-black tracking-tighter leading-none">
                            Shop Featured Pieces
                        </h2>
                    </div>
                    <Suspense fallback={<FeaturedProductsSkeleton />}>
                        <SuspensefulFeaturedProducts />
                    </Suspense>
                </section>
            </HomeClient>
        </div>
    );
}
