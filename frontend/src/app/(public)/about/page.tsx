import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the maker behind DK's Cake World. Homemade cakes crafted with love in Hosur.",
};

export default function AboutPage() {
  return <AboutClient />;
}
