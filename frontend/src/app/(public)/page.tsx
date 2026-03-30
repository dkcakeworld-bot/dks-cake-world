import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "DK's Cake World — Homemade Cakes in Hosur",
  description: "Order fresh homemade cakes, brownies, pastries and special cakes in Hosur. Call or WhatsApp +91 8072 427 902",
};

export default function HomePage() {
  return <HomeClient />;
}
