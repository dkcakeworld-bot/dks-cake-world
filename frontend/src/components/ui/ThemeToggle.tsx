'use client';

import { useThemeStore } from '@/store/themeStore';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full
                 bg-primary/10 dark:bg-primary/20
                 text-primary hover:bg-primary/20 dark:hover:bg-primary/30
                 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={18} className="transition-transform duration-300" />
      ) : (
        <Sun size={18} className="transition-transform duration-300" />
      )}
    </button>
  );
}
