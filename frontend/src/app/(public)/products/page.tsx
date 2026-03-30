import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: "Our Cakes",
  description: "Browse our full menu of brownies, pastries, chocolate cakes and special cakes. Fresh homemade in Hosur.",
};

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-[#FFF5F8] dark:bg-[#110609] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C2185B] border-t-transparent mx-auto mb-4"></div>
        <p className="text-[#C2185B] font-semibold text-lg">Loading cakes...</p>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsClient />
    </Suspense>
  );
}
