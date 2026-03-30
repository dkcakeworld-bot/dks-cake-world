'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import api from '@/lib/api';

interface GalleryItem {
  _id: string;
  imageUrl: string;
  description: string;
}

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    api
      .get('/gallery')
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="section-title">
          Our <span className="gradient-text">Gallery</span>
        </h1>
        <p className="section-subtitle">A peek into our sweetest creations 🎂</p>
      </div>

      {loading ? (
        <div className="masonry-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="skeleton masonry-item rounded-2xl"
              style={{ height: `${Math.floor(Math.random() * 150) + 200}px` }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📸</p>
          <p className="text-[var(--muted)]">Gallery photos coming soon!</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {items.map((item) => (
            <div
              key={item._id}
              className="masonry-item group cursor-pointer relative overflow-hidden rounded-2xl"
              onClick={() => setLightboxItem(item)}
            >
              <Image
                src={item.imageUrl}
                alt={item.description || 'Gallery image'}
                width={400}
                height={500}
                className="w-full h-auto object-cover transition-transform duration-500
                           group-hover:scale-105"
              />
              {/* Hover overlay with description */}
              {item.description && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                       bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setLightboxItem(null)}
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxItem.imageUrl}
              alt={lightboxItem.description || 'Gallery image'}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            {lightboxItem.description && (
              <p className="text-white/80 text-center mt-4 text-sm">
                {lightboxItem.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
