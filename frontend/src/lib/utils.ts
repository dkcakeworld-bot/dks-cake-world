import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function buildWhatsAppLink(
  cakeName: string,
  kg: string,
  price: number
): string {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\s+/g, '');
  const message = encodeURIComponent(
    `Hi! I'd like to order *${cakeName}* (${kg}) at ${formatPrice(price)} from DK's Cake World. 🎂`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

export function buildTelLink(): string {
  const phone = (process.env.NEXT_PUBLIC_PHONE || '').replace(/\s+/g, '');
  return `tel:${phone}`;
}
