'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Leaf, Drumstick } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import BuyNowSheet from '@/components/products/BuyNowSheet';

interface Product {
  _id: string;
  name: string;
  prices: { halfKg: number; oneKg: number };
  imageUrl: string;
  isVeg: boolean;
  category?: { name: string; slug: string };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedKg, setSelectedKg] = useState<'½ KG' | '1 KG'>('½ KG');
  const [showBuyNow, setShowBuyNow] = useState(false);

  const price = selectedKg === '½ KG' ? product.prices.halfKg : product.prices.oneKg;

  return (
    <>
      <div className="card overflow-hidden group flex flex-col h-full bg-card-light dark:bg-card-dark">
        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-border-light dark:bg-border-dark shrink-0">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center
                            bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-5xl">🎂</span>
            </div>
          )}

          {/* Veg/NonVeg badge */}
          <div className="absolute top-3 left-3 z-10">
            {product.isVeg ? (
              <span className="badge-veg">
                <Leaf size={12} /> Veg
              </span>
            ) : (
              <span className="badge-nonveg">
                <Drumstick size={12} /> Non-Veg
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Top part inside content, allowing flex-1 to push the button down */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-playfair text-base sm:text-lg font-bold text-[var(--text)] line-clamp-2 mb-3 h-12">
              {product.name}
            </h3>

            {/* Kg selector chips */}
            <div className="flex gap-2 mb-3">
              {(['½ KG', '1 KG'] as const).map((kg) => (
                <button
                  key={kg}
                  onClick={() => setSelectedKg(kg)}
                  className={cn(
                    'flex-1 px-2 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-center border-transparent shadow-sm',
                    selectedKg === kg
                      ? 'bg-primary text-white shadow-card'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  )}
                >
                  {kg}
                </button>
              ))}
            </div>

            {/* Price display */}
            <div className="mb-4">
              <span className="text-xl sm:text-2xl font-bold gradient-text">{formatPrice(price)}</span>
            </div>
          </div>

          {/* Buy Now Button - sticky to bottom */}
          <button
            onClick={() => setShowBuyNow(true)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 mt-auto
                       bg-[#C2185B] text-white rounded-xl font-semibold
                       transition-all duration-300 hover:scale-[1.02] hover:shadow-glow active:scale-95"
          >
            <ShoppingBag size={18} />
            <span className="hidden xs:inline sm:inline">Buy Now</span>
            <span className="xs:hidden sm:hidden">Buy</span>
          </button>
        </div>
      </div>

      <BuyNowSheet
        isOpen={showBuyNow}
        onClose={() => setShowBuyNow(false)}
        cakeName={product.name}
        selectedKg={selectedKg}
        price={price}
        imageUrl={product.imageUrl}
        categorySlug={product.category?.slug || 'all'}
      />
    </>
  );
}
