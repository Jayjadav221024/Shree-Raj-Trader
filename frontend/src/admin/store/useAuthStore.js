import { create } from 'zustand';
import api from '../lib/axios';

const EMPTY_SESSION = {
  user: null,
  menuGroups: [],
  permittedMenus: [],
  permissions: [],
  isAuthenticated: false,
};

export const useAuthStore = create((set, get) => ({
  ...EMPTY_SESSION,

  /** True only while the initial session probe is in flight. */
  isLoading: false,
  /** Flips once `checkAuth` has resolved, so guards know the session is settled. */
  isInitialized: false,

  theme: 'light',
  /** Desktop rail collapse. */
  sidebarCollapsed: false,
  /** Mobile off-canvas drawer. */
  mobileNavOpen: false,

  login: async (email, password) => {
    // Deliberately does not touch `isLoading`: that flag gates the admin route
    // guard, and raising it here would unmount the login form mid-submit.
    await api.post('/auth/login', { email, password });

    const res = await api.get('/auth/me');
    const { user, menuGroups, permittedMenus, permissions } = res.data.data;

    set({
      user,
      menuGroups,
      permittedMenus,
      permissions,
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      set({ ...EMPTY_SESSION, isInitialized: true, isLoading: false });
    }
  },

  checkAuth: async () => {
    // A second concurrent probe would just duplicate the request.
    if (get().isLoading) return;

    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      const { user, menuGroups, permittedMenus, permissions } = res.data.data;

      set({
        user,
        menuGroups,
        permittedMenus,
        permissions,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      set({ ...EMPTY_SESSION, isInitialized: true, isLoading: false });
    }
  },

  /** Drops the local session without calling the API — used on a 401 response. */
  clearSession: () => set({ ...EMPTY_SESSION, isInitialized: true, isLoading: false }),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  toggleMobileNav: () => {
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen }));
  },
}));
