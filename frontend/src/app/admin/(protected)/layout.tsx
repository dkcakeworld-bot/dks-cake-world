'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Layers, Image as ImageIcon, SlidersHorizontal,
  Palette, Info, MessageSquare, LogOut, Cake, ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/admin/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/products',   label: 'Products',    icon: Package },
  { href: '/admin/categories', label: 'Categories',  icon: Layers },
  { href: '/admin/gallery',    label: 'Gallery',     icon: ImageIcon },
  { href: '/admin/carousel',   label: 'Carousel',    icon: SlidersHorizontal },
  { href: '/admin/branding',   label: 'Branding',    icon: Palette },
  { href: '/admin/about',      label: 'About',       icon: Info },
  { href: '/admin/feedbacks',  label: 'Feedbacks',   icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cake-light dark:bg-cake-dark">
        <div className="animate-spin-slow">
          <Cake size={48} className="text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-cake-light dark:bg-cake-dark">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card-light dark:bg-card-dark
                        border-r border-border-light dark:border-border-dark">
        {/* Logo */}
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-rose flex items-center justify-center">
              <Cake size={18} className="text-white" />
            </div>
            <span className="font-dancing text-xl text-primary font-bold">DK&apos;s Cake World</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-primary text-white shadow-card'
                    : 'text-[var(--text)] hover:bg-primary/10 hover:text-primary'
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border-light dark:border-border-dark space-y-2">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Link href="/" className="btn-ghost text-xs">
              <ChevronLeft size={14} /> Site
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm
                       text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4
                        bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
          <span className="font-dancing text-lg text-primary font-bold">DK Admin</span>
          <div className="flex gap-2">
            <ThemeToggle />
            <button onClick={handleLogout} className="text-red-500 p-2">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40
                        bg-card-light/95 dark:bg-card-dark/95 backdrop-blur-md
                        border-t border-border-light dark:border-border-dark
                        flex overflow-x-auto no-scrollbar">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 min-w-[64px] text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-[var(--muted)]'
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 md:p-8 pb-24 md:pb-8">{children}</div>
      </main>
    </div>
  );
}
