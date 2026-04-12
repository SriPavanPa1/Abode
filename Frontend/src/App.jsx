import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import useSettingsStore from './store/settingsStore';
import './styles/index.css';
import './styles/components.css';
import './styles/animations.css';

function ThemeInitializer({ children }) {
  const { initTheme } = useSettingsStore();
  useEffect(() => { initTheme(); }, []);
  return children;
}

export default function App() {
  return (
    <ThemeInitializer>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: 'var(--color-text-primary)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              fontSize: '0.875rem',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: 'transparent' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: 'transparent' },
            },
          }}
        />
      </BrowserRouter>
    </ThemeInitializer>
  );
}
