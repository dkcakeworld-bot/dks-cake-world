'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

interface AboutData {
  ownerImageUrl: string;
  content: string;
}

export default function AboutClient() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/about')
      .then((r) => setAbout(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="section-title">
          About <span className="gradient-text">Us</span>
        </h1>
        <p className="section-subtitle">The story behind every sweet bite 💕</p>
      </div>

      {loading ? (
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="skeleton w-64 h-64 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Owner image */}
          <div className="shrink-0">
            {about?.ownerImageUrl ? (
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden
                              ring-4 ring-primary/20 shadow-glow">
                <Image
                  src={about.ownerImageUrl}
                  alt="DK's Cake World Owner"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full
                              bg-gradient-to-br from-primary/20 to-accent/20
                              flex items-center justify-center">
                <span className="text-6xl">👩‍🍳</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">
              Welcome to DK&apos;s Cake World
            </h2>
            <div className="text-[var(--muted)] text-base md:text-lg leading-relaxed space-y-4">
              {about?.content ? (
                about.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p>Content will be updated soon!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
