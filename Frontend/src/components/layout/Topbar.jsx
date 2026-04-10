import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, ChevronRight, Menu, Sun, Moon, Globe } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import { ROLES } from '../../utils/constants';
import apartmentsData from '../../api/mockData/apartments.json';

const LANG_OPTIONS = [
  { value: 'en', label: 'EN' },
  { value: 'hi', label: 'हि' },
  { value: 'te', label: 'తె' },
];

export default function Topbar({ onMobileMenuOpen }) {
  const location = useLocation();
  const { user, switchApartment } = useAuthStore();
  const { theme, toggleTheme, language, setLanguage, t } = useSettingsStore();

  const ROUTE_LABELS = {
    '/dashboard': t('dashboard'),
    '/apartments': t('apartments'),
    '/expenses': t('expensesAndMaintenance'),
    '/notices': t('noticeBoard'),
    '/notices/create': t('createNotice'),
    '/complaints': t('complaints'),
    '/complaints/create': t('newComplaint'),
    '/directory': t('residentDirectoryTitle'),
    '/visitors': t('visitorLogs'),
    '/visitors/add': t('addEntry'),
  };

  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .reduce((acc, segment, index, arr) => {
      const path = '/' + arr.slice(0, index + 1).join('/');
      const label = ROUTE_LABELS[path] || segment;
      acc.push({ path, label });
      return acc;
    }, []);

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--color-bg-secondary)',
      borderBottom: '1px solid var(--color-surface-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--space-6)',
      gap: 'var(--space-4)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
    }}>
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        style={{ color: 'var(--color-text-tertiary)', display: 'none', padding: 6, borderRadius: 6 }}
        className="topbar__mobile-menu"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />}
            {i === crumbs.length - 1 ? (
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Apartment selector (Super Admin only) */}
      {user?.role === ROLES.SUPER_ADMIN && (
        <select
          value={user?.apartment_id || ''}
          onChange={(e) => switchApartment(e.target.value || null)}
          style={{
            height: 36, padding: '0 32px 0 12px', borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-primary)', border: '1px solid var(--color-surface-border)',
            color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 8px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
          }}
        >
          <option value="">All Apartments</option>
          {apartmentsData.map((apt) => (
            <option key={apt.id} value={apt.id}>{apt.name}</option>
          ))}
        </select>
      )}

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>

        {/* Language selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-surface-border)', overflow: 'hidden',
        }}>
          {LANG_OPTIONS.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              style={{
                height: 34, padding: '0 10px',
                fontSize: 'var(--font-size-xs)', fontWeight: 600,
                color: language === lang.value ? '#fff' : 'var(--color-text-tertiary)',
                background: language === lang.value ? 'var(--color-accent)' : 'transparent',
                transition: 'all var(--transition-fast)',
                borderRight: '1px solid var(--color-surface-border)',
              }}
              aria-label={`Switch to ${lang.label}`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-tertiary)', position: 'relative',
            transition: 'all var(--transition-fast)',
          }}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="topbar__icon-btn"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-tertiary)', position: 'relative',
            transition: 'all var(--transition-fast)',
          }}
          aria-label={t('notifications')}
          className="topbar__icon-btn"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 8, height: 8,
            borderRadius: '50%', background: 'var(--color-accent)',
          }} />
        </button>
      </div>

      <style>{`
        .topbar__icon-btn:hover { background: var(--color-bg-hover); color: var(--color-text-primary) !important; }
        @media (max-width: 768px) {
          .topbar__mobile-menu { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
