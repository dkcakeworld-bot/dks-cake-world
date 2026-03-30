import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Dancing_Script } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmsans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: "%s | DK's Cake World",
    default: "DK's Cake World — Homemade Cakes in Hosur",
  },
  description: "Order fresh homemade cakes, brownies, pastries and special cakes in Hosur. Call or WhatsApp +91 8072 427 902",
  keywords: "homemade cakes hosur, brownies hosur, cake order hosur, DK cake world, pastries hosur, chocolate cake hosur",
  authors: [{ name: "DK's Cake World" }],
  openGraph: {
    title: "DK's Cake World — Homemade Cakes in Hosur",
    description: "Order fresh homemade cakes, brownies, pastries and special cakes in Hosur. Call or WhatsApp +91 8072 427 902",
    type: 'website',
    images: ['/logo/logo.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "DK's Cake World",
    description: "Order fresh homemade cakes, brownies, pastries and special cakes in Hosur.",
    images: ['/logo/logo.jpeg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmsans.variable} ${dancing.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="font-dmsans antialiased">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--card-bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-dmsans)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#C2185B', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
