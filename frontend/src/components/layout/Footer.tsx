'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE || '';
  const email = process.env.NEXT_PUBLIC_EMAIL || '';
  const address = process.env.NEXT_PUBLIC_ADDRESS || '';

  return (
    <footer className="bg-cake-dark text-white/90 border-t border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left — Logo from public folder & tagline */}
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo/logo.jpeg"
                alt="DK's Cake World Logo"
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-dancing text-3xl text-primary font-bold">
                DK&apos;s Cake World
              </span>
            </Link>
            <p className="mt-4 text-white/60 text-sm max-w-xs">
              Homemade cakes baked with love in Hosur. Every bite tells a sweet story. 🎂
            </p>
          </div>

          {/* Right — Contact info */}
          <div className="space-y-3 text-sm">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Phone size={16} className="text-primary shrink-0" />
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Mail size={16} className="text-primary shrink-0" />
              {email}
            </a>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-primary shrink-0" />
              {address}
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} DK&apos;s Cake World. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
