'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

interface CarouselSlide {
  _id: string;
  imageUrl: string;
  caption: string;
  order: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export default function HomeClient() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/carousel'), api.get('/categories')])
      .then(([carouselRes, catRes]) => {
        setSlides(carouselRes.data);
        setCategories(catRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-slide carousel
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [slides.length, nextSlide]);

  return (
    <div>
      {/* ── Hero Carousel ────────────────────── */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden bg-cake-dark">
        {slides.length > 0 ? (
          <>
            {slides.map((slide, index) => (
              <div
                key={slide._id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.caption || 'DK\'s Cake World'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                {slide.caption && (
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="font-playfair text-2xl md:text-4xl font-bold drop-shadow-lg">
                      {slide.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Dot indicators */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? 'bg-primary w-7'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Fallback hero when no carousel images */
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/90 to-accent/80">
            <div className="text-center text-white px-4">
              <Sparkles className="mx-auto mb-4 animate-bounce-gentle" size={48} />
              <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
                DK&apos;s Cake World
              </h1>
              <p className="font-dmsans text-lg md:text-xl opacity-90 max-w-md mx-auto">
                Homemade cakes baked with love in Hosur 🎂
              </p>
              <Link href="/products" className="btn-primary mt-8 inline-flex">
                Explore Cakes <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── Category Tiles ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Our <span className="gradient-text">Delicious</span> Categories
          </h2>
          <p className="section-subtitle">Pick your favourite — every bite is a celebration!</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products/${cat.slug}`}
                className="card group relative overflow-hidden rounded-2xl aspect-[4/5]"
              >
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-playfair text-white text-lg md:text-xl font-bold">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-white/80 group-hover:text-accent transition-colors">
                    View all <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ───────────────────────── */}
      <section className="bg-gradient-rose py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Craving Something Sweet? 🍰
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Explore our full menu or order your favourite cake via WhatsApp!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products" className="btn-accent">
              Browse All Cakes <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\s+/g, '')}?text=${encodeURIComponent("Hi! I'd like to order a cake from DK's Cake World 🎂")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
