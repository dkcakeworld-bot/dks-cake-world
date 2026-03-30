'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Phone, MessageCircle, Construction } from 'lucide-react';
import { formatPrice, buildTelLink } from '@/lib/utils';

interface BuyNowSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cakeName: string;
  selectedKg: string;
  price: number;
  imageUrl?: string;
  categorySlug?: string;
}

export default function BuyNowSheet({
  isOpen,
  onClose,
  cakeName,
  selectedKg,
  price,
  imageUrl = '',
  categorySlug = 'all',
}: BuyNowSheetProps) {
  const [productUrl, setProductUrl] = useState('');

  // We capture the origin inside useEffect because window is not available on Server
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProductUrl(`${window.location.origin}/products/${categorySlug}`);
    }
  }, [categorySlug]);

  const generateWhatsAppLink = () => {
    const phone = (process.env.NEXT_PUBLIC_WHATSAPP || '+918072427902').replace(/[^0-9]/g, '');
    const finalPhone = phone.startsWith('91') ? phone : `91${phone}`;

    const text = `Hi DK's Cake World! 🎂\nI want to order:\n🍰 Cake: ${cakeName}\n⚖️ Weight: ${selectedKg}\n💰 Price: ${formatPrice(price)}\n📸 Product Image: ${imageUrl}\n🔗 Product Link: ${productUrl}\nPlease confirm my order!`;
    const message = encodeURIComponent(text);
    return `https://wa.me/${finalPhone}?text=${message}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-up">
        <div className="bg-card-light dark:bg-card-dark rounded-t-3xl shadow-2xl max-w-lg mx-auto
                        border-t border-x border-border-light dark:border-border-dark">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-[var(--muted)]/30 rounded-full" />
          </div>

          <div className="px-6 pb-8">
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full
                           bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cake info */}
            <div className="text-center mb-6">
              {imageUrl && (
                <div className="mx-auto w-24 h-24 relative rounded-full overflow-hidden shadow-card mb-3 border-2 border-primary/20">
                  <Image src={imageUrl} alt={cakeName} fill className="object-cover" />
                </div>
              )}
              <h3 className="font-playfair text-xl font-bold text-[var(--text)]">{cakeName}</h3>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {selectedKg}
                </span>
                <span className="text-2xl font-bold gradient-text">{formatPrice(price)}</span>
              </div>
            </div>

            {/* Coming soon badge */}
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2.5
                            bg-accent/10 border border-accent/30 rounded-xl text-sm text-accent-700 dark:text-accent-300">
              <Construction size={16} className="text-accent" />
              <span>🚧 Online booking coming soon</span>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <a
                href={buildTelLink()}
                className="btn-primary w-full justify-center"
              >
                <Phone size={18} />
                Call Now
              </a>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
