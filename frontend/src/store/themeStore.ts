import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('dk-theme') as Theme | null;
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: typeof window !== 'undefined' ? getInitialTheme() : 'light',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('dk-theme', next);
      return { theme: next };
    }),
  setTheme: (t: Theme) => {
    localStorage.setItem('dk-theme', t);
    set({ theme: t });
  },
}));
