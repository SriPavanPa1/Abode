import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Wallet, Megaphone,
  MessageSquare, Users, UserCheck, ChevronLeft,
  ChevronRight, LogOut, X,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import { ROLES } from '../../utils/constants';
import { getInitials } from '../../utils/formatters';

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const { t } = useSettingsStore();
  const location = useLocation();

  const NAV_ITEMS = [
    { label: t('dashboard'), icon: LayoutDashboard, path: '/dashboard', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTION, ROLES.RESIDENT] },
    { label: t('apartments'), icon: Building2, path: '/apartments', roles: [ROLES.SUPER_ADMIN] },
    { label: t('expenses'), icon: Wallet, path: '/expenses', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RESIDENT] },
    { label: t('notices'), icon: Megaphone, path: '/notices', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTION, ROLES.RESIDENT] },
    { label: t('complaints'), icon: MessageSquare, path: '/complaints', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTION, ROLES.RESIDENT] },
    { label: t('directory'), icon: Users, path: '/directory', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTION, ROLES.RESIDENT] },
    { label: t('visitors'), icon: UserCheck, path: '/visitors', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTION] },
  ];

  const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: t('superAdmin'),
    [ROLES.ADMIN]: t('admin'),
    [ROLES.MANAGER]: t('manager'),
    [ROLES.RECEPTION]: t('reception'),
    [ROLES.RESIDENT]: t('resident'),
  };

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 'var(--z-modal-backdrop)' }}
          onClick={onMobileClose}
        />
      )}

      <aside
        style={{
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          minHeight: '100vh',
          background: 'var(--color-bg-secondary)',
          borderRight: '1px solid var(--color-surface-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--transition-slow)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
        className={`sidebar ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
      >
        {/* Logo */}
        <div style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--space-5)',
          borderBottom: '1px solid var(--color-surface-border)',
          gap: 'var(--space-3)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontWeight: 800, fontSize: 18, color: '#fff',
          }}>A</div>
          {!collapsed && (
            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', whiteSpace: 'nowrap' }}>
              Abode
            </span>
          )}
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            style={{ marginLeft: 'auto', display: 'none' }}
            className="sidebar__mobile-close"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 'var(--space-4) var(--space-3)', overflowY: 'auto' }}>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 'var(--space-3)', padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-1)',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                  background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 'var(--font-size-sm)',
                  transition: 'all var(--transition-fast)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                }}
                className="nav-link"
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: 'var(--space-4) var(--space-3)',
          borderTop: '1px solid var(--color-surface-border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg-tertiary)', overflow: 'hidden',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontWeight: 700, fontSize: 13, color: '#fff',
            }}>
              {getInitials(user?.name)}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                  {ROLE_LABELS[user?.role]}
                </div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                style={{ color: 'var(--color-text-muted)', flexShrink: 0, padding: 4, borderRadius: 6 }}
                title={t('logout')}
                aria-label={t('logout')}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginTop: 'var(--space-3)',
              width: '100%', height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            z-index: var(--z-modal) !important;
            transform: translateX(-100%);
            transition: transform var(--transition-slow) !important;
            width: var(--sidebar-width) !important;
          }
          .sidebar--mobile-open {
            transform: translateX(0) !important;
          }
          .sidebar__mobile-close {
            display: flex !important;
          }
        }
        .nav-link:hover {
          background: var(--color-bg-hover) !important;
          color: var(--color-text-primary) !important;
        }
      `}</style>
    </>
  );
}
