import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../api/services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err) {
          set({ isLoading: false, error: err.message });
          throw err;
        }
      },

      loginAsRole: async (role) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.loginAsRole(role);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err) {
          set({ isLoading: false, error: err.message });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      switchApartment: (apartmentId) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, apartment_id: apartmentId } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'abode-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
