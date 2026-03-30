'use client';

import { useState, useEffect } from 'react';
import { Package, Image as ImageIcon, MessageSquare, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  products: number;
  gallery: number;
  feedbacks: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, gallery: 0, feedbacks: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, gallery, feedbacks, categories] = await Promise.all([
          api.get('/products'),
          api.get('/gallery'),
          api.get('/feedback'),
          api.get('/categories'),
        ]);
        setStats({
          products: products.data.length,
          gallery: gallery.data.length,
          feedbacks: feedbacks.data.length,
          categories: categories.data.length,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'text-primary bg-primary/10' },
    { label: 'Categories', value: stats.categories, icon: ShoppingBag, color: 'text-accent bg-accent/10' },
    { label: 'Gallery', value: stats.gallery, icon: ImageIcon, color: 'text-green-500 bg-green-500/10' },
    { label: 'Feedbacks', value: stats.feedbacks, icon: MessageSquare, color: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <div>
      <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[var(--text)] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5 md:p-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--text)]">
                {loading ? '—' : card.value}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
