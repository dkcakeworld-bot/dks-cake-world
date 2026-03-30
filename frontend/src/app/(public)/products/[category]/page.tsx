import type { Metadata } from 'next';
import { Suspense } from 'react';
import CategoryClient from './CategoryClient';

interface Props {
  params: { category: string };
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  brownies: {
    title: "Brownies — DK's Cake World | Hosur",
    description: "Choco Chip, Walnut, Biscoff, Classic and more homemade brownies. Starting ₹250. Order now!",
  },
  pastries: {
    title: "Pastries — DK's Cake World | Hosur",
    description: "Black Forest, Butterscotch, Mango, Strawberry and more fresh pastries. Starting ₹400. Order now!",
  },
  'chocolate-cakes': {
    title: "Chocolate Cakes — DK's Cake World | Hosur",
    description: "KitKat Cake, Oreo Cake, Nutella Hazelnut, Chocolate Truffle and more. Starting ₹600. Order now!",
  },
  'special-cakes': {
    title: "Special Cakes — DK's Cake World | Hosur",
    description: "Gulab Jamun Cake, Rasamalai Cake, Rasgulla Cake — unique Indian fusion cakes. Starting ₹400!",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CATEGORY_META[params.category];

  if (meta) {
    return {
      title: { absolute: meta.title },
      description: meta.description,
    };
  }

  // Fallback for any other dynamically added category
  const fallbackTitle = params.category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${fallbackTitle} — DK's Cake World`,
    description: `Order fresh ${fallbackTitle.toLowerCase()} from DK's Cake World in Hosur.`,
  };
}

function CategoryPageFallback() {
  return (
    <div className="min-h-screen bg-[#FFF5F8] dark:bg-[#110609] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C2185B] border-t-transparent mx-auto mb-4"></div>
        <p className="text-[#C2185B] font-semibold text-lg">Loading category...</p>
      </div>
    </div>
  );
}

export default function CategoryProductsPage() {
  return (
    <Suspense fallback={<CategoryPageFallback />}>
      <CategoryClient />
    </Suspense>
  );
}
