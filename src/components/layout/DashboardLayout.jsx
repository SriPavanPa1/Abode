import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
