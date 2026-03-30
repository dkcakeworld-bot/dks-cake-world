import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: "Gallery",
  description: "See our beautiful homemade cakes, brownies and pastries. Made fresh in Hosur with love.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
