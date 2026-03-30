'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import api from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';

type SortMode = 'all' | 'price-asc' | 'price-desc' | 'a-z';

interface Product {
  _id: string;
  name: string;
  prices: { halfKg: number; oneKg: number };
  imageUrl: string;
  isVeg: boolean;
  category?: { name: string; slug: string };
}

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.category as string;
  const searchQuery = searchParams?.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortMode>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/category/${slug}`);
        setCategory(data.category);
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProducts();
  }, [slug]);

  // Filter by search + sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.prices.halfKg - b.prices.halfKg);
        break;
      case 'price-desc':
        result.sort((a, b) => b.prices.halfKg - a.prices.halfKg);
        break;
      case 'a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, sort, searchQuery]);

  const SORT_OPTIONS: { value: SortMode; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'price-asc', label: 'Price: Low–High' },
    { value: 'price-desc', label: 'Price: High–Low' },
    { value: 'a-z', label: 'A–Z' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back + Title */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} /> All Categories
        </Link>
        <h1 className="section-title">
          {category?.name || <span className="skeleton w-48 h-8 inline-block" />}
        </h1>
        {searchQuery && (
          <p className="section-subtitle">
            Showing results for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Filter/Sort bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <SlidersHorizontal size={16} className="text-[var(--muted)]" />
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
              sort === opt.value
                ? 'bg-primary text-white shadow-card'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-80 rounded-2xl" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 max-w-lg mx-auto">
          <p className="text-5xl mb-4">😢</p>
          <p className="text-[var(--text)] text-lg mb-2">
            No cakes found for &apos;{searchQuery}&apos; in this category.
          </p>
          <p className="text-[var(--muted)]">
            Try searching: Brownie, Chocolate, Pastry
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
