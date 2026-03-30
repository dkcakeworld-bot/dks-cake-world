import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface Admin {
  id: string;
  username: string;
}

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username: string, password: string) => {
    const { data } = await api.post('/auth/login', { username, password });
    // Store the token for axios interceptor (backup for httpOnly cookie)
    if (data.token) {
      Cookies.set('adminToken', data.token, { expires: 7 });
    }
    set({ admin: data.admin, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    Cookies.remove('adminToken');
    set({ admin: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/auth/me');
      set({ admin: { id: data._id, username: data.username }, isAuthenticated: true });
    } catch {
      set({ admin: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
