'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

interface Product {
  _id: string;
  name: string;
  prices: { halfKg: number; oneKg: number };
  imageUrl: string;
  isVeg: boolean;
  category?: { name: string; slug: string };
}

interface ProductCount {
  [slug: string]: number;
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<ProductCount>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (searchQuery) {
          // If search query is present, fetch matched products
          const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}`);
          setProducts(res.data);
        } else {
          // Normal mode: fetch categories and count stuff
          const [catRes, prodRes] = await Promise.all([
            api.get('/categories'),
            api.get('/products'),
          ]);
          setCategories(catRes.data);

          const counts: ProductCount = {};
          prodRes.data.forEach((p: any) => {
            const slug = p.category?.slug;
            if (slug) counts[slug] = (counts[slug] || 0) + 1;
          });
          setProductCounts(counts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {searchQuery ? (
        // --- SEARCH RESULTS VIEW ---
        <>
          <div className="text-center mb-12">
            <h1 className="section-title">
              Search <span className="gradient-text">Results</span>
            </h1>
            <p className="section-subtitle">
              Showing results for: &ldquo;{searchQuery}&rdquo;
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-80 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 max-w-lg mx-auto">
              <p className="text-5xl mb-4">😢</p>
              <p className="text-[var(--text)] text-lg mb-2">
                No cakes found for &apos;{searchQuery}&apos;
              </p>
              <p className="text-[var(--muted)]">
                Try searching: Brownie, Chocolate, Pastry
              </p>
              <Link href="/products" className="btn-primary mt-6 inline-flex">
                View All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      ) : (
        // --- ALL CATEGORIES VIEW (DEFAULT) ---
        <>
          <div className="text-center mb-12">
            <h1 className="section-title">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="section-subtitle">
              Choose a category to explore our delicious creations
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  id={`category-${cat.slug}`}
                  key={cat._id}
                  href={`/products/${cat.slug}`}
                  className="card group relative overflow-hidden rounded-2xl aspect-[3/4]"
                >
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-playfair text-white text-xl font-bold">
                      {cat.name}
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                      {productCounts[cat.slug] || 0} items
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-white/80
                                     group-hover:text-accent transition-colors">
                      View all <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
