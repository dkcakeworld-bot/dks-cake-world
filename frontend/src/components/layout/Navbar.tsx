'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Mic, X, Menu as MenuIcon, BookOpen, User } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import VoiceSearchModal from '@/components/VoiceSearchModal';

interface Branding {
  menuCardUrl: string;
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Cakes' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/feedbacks', label: 'Feedbacks' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [branding, setBranding] = useState<Branding | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuCardOpen, setMenuCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Voice Modal State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const { isAuthenticated } = useAuthStore();

  // Fetch branding (only for menu card now since logo is local)
  useEffect(() => {
    api.get('/branding').then((r) => setBranding(r.data)).catch(() => {});
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open Voice Search popup
  const openVoiceSearch = useCallback(() => {
    setIsVoiceModalOpen(true);
  }, []);

  // Close Voice Search popup
  const closeVoiceSearch = useCallback(() => {
    setIsVoiceModalOpen(false);
  }, []);

  // Triggered when Voice Search returns a successful transcript
  const handleVoiceResult = useCallback((result: string) => {
    setSearchQuery(result);
    setIsVoiceModalOpen(false);
    router.push(`/products?search=${encodeURIComponent(result)}`);
  }, [router]);

  // Standard Text Search redirect
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'navbar-blur shadow-md' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo from /public/logo/ */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <Image
                src="/logo/logo.jpeg"
                alt="DK's Cake World Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-dancing text-2xl md:text-3xl text-primary font-bold hidden sm:block">
                DK&apos;s Cake World
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'bg-primary text-white shadow-card'
                      : 'text-[var(--text)] hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search bar (center on desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-card-dark/80
                         border border-border-light dark:border-border-dark
                         rounded-full px-4 py-2 w-64 lg:w-80
                         focus-within:ring-2 focus-within:ring-primary/50 transition-all"
            >
              <button type="submit" aria-label="Search" className="text-[var(--muted)] hover:text-primary">
                <Search size={16} className="shrink-0" />
              </button>
              <input
                id="navbar-search"
                type="text"
                placeholder="Search cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--muted)]"
              />
              <button
                type="button"
                onClick={openVoiceSearch}
                className={cn(
                  'shrink-0 p-1 rounded-full transition-colors',
                  isVoiceModalOpen ? 'text-primary' : 'text-[var(--muted)] hover:text-primary'
                )}
                aria-label="Voice search"
              >
                <Mic size={16} />
              </button>
            </form>

            {/* Right side actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Menu Card button */}
              <button
                id="menu-card-btn"
                onClick={() => setMenuCardOpen(true)}
                className="hidden sm:inline-flex btn-ghost text-sm px-2 sm:px-3"
              >
                <BookOpen size={16} />
                <span className="hidden lg:inline">Menu Card</span>
              </button>

              <ThemeToggle />

              {isAuthenticated && (
                <Link
                  href="/admin/dashboard"
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full
                             bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  title="Admin Dashboard"
                >
                  <User size={18} />
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                id="mobile-menu-btn"
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full
                           bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <form
            onSubmit={handleSearch}
            className="md:hidden flex items-center gap-2 mx-2 mb-3 mt-1
                       bg-white/80 dark:bg-card-dark/80
                       border border-border-light dark:border-border-dark
                       rounded-full px-4 py-2
                       focus-within:ring-2 focus-within:ring-primary/50"
          >
            <button type="submit" aria-label="Search" className="text-[var(--muted)] hover:text-primary">
              <Search size={16} className="shrink-0" />
            </button>
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-[var(--text)]"
            />
            <button
              type="button"
              onClick={openVoiceSearch}
              className={cn(
                'shrink-0 p-1 rounded-full',
                isVoiceModalOpen ? 'text-primary' : 'text-[var(--muted)]'
              )}
              aria-label="Voice search"
            >
              <Mic size={16} />
            </button>
          </form>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <div className="lg:hidden bg-cake-light/95 dark:bg-cake-dark/95 backdrop-blur-xl border-t border-border-light dark:border-border-dark animate-slide-in-up shadow-xl">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary text-white font-bold'
                      : 'text-[var(--text)] hover:bg-primary/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border-light dark:border-border-dark my-2 pt-2"></div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setMenuCardOpen(true);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                           text-[var(--text)] hover:bg-primary/10 flex items-center gap-2"
              >
                <BookOpen size={16} />
                Menu Card
              </button>
              {isAuthenticated && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                             text-accent hover:bg-accent/10 flex items-center gap-2"
                >
                  <User size={16} />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Voice Search Modal Popup */}
      <VoiceSearchModal 
        isOpen={isVoiceModalOpen} 
        onClose={closeVoiceSearch} 
        onResult={handleVoiceResult} 
      />

      {/* Menu Card Modal */}
      {menuCardOpen && (
        <div className="overlay z-50 flex items-center justify-center p-4" onClick={() => setMenuCardOpen(false)}>
          <div
            className="relative bg-card-light dark:bg-card-dark rounded-2xl
                       max-w-lg w-full max-h-[85vh] overflow-auto shadow-2xl animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenuCardOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center
                         bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <X size={16} />
            </button>
            {branding?.menuCardUrl ? (
               <div className="w-full h-auto p-1 bg-white dark:bg-card-dark rounded-2xl">
                 <Image
                   src={branding.menuCardUrl}
                   alt="Menu Card"
                   width={600}
                   height={800}
                   className="w-full h-auto rounded-xl object-contain"
                 />
               </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen size={48} className="mx-auto text-[var(--muted)] mb-4" />
                <p className="text-[var(--text)] font-medium">Menu card will be uploaded soon!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer replacing fixed height so content doesn't get hidden behind navbar */}
      <div className="h-[120px] md:h-[90px]" />
    </>
  );
}
