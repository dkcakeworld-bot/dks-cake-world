"use client"
import type { Metadata } from 'next';
import FeedbacksClient from './FeedbacksClient';

// export const metadata: Metadata = {
//   title: "Customer Reviews",
//   description: "See what our happy customers say about DK's Cake World homemade cakes in Hosur.",
// };

export default function FeedbacksPage() {
  return <FeedbacksClient />;
}
