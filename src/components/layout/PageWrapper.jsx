import React from 'react';

export default function PageWrapper({ title, subtitle, actions, children, className = '' }) {
  return (
    <main className={`anim-fade-in ${className}`} style={{ padding: 'var(--space-8)', flex: 1 }}>
      {(title || actions) && (
        <div
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)',
          }}
        >
          <div>
            {title && (
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: subtitle ? 'var(--space-1)' : 0 }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </main>
  );
}
