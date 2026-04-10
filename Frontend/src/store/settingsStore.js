import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import translations from '../utils/translations';

const useSettingsStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'
      language: 'en', // 'en' | 'hi' | 'te'

      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },

      setLanguage: (language) => set({ language }),

      // Translation helper – returns the translated string for a key
      t: (key) => {
        const lang = get().language;
        return translations[lang]?.[key] || translations.en[key] || key;
      },

      // Initialize theme on app load
      initTheme: () => {
        const theme = get().theme;
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'abode-settings',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);

export default useSettingsStore;
