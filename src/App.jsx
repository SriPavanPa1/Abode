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
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: 'var(--color-bg-elevated)' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: 'var(--color-bg-elevated)' },
            },
          }}
        />
      </BrowserRouter>
    </ThemeInitializer>
  );
}
