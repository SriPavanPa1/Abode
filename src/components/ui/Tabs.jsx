import React from 'react';

export default function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          className={`tabs__item ${active === tab.value ? 'tabs__item--active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          {tab.count != null && (
            <span
              style={{
                marginLeft: 'var(--space-2)',
                background: active === tab.value ? 'var(--color-accent)' : 'var(--color-bg-active)',
                color: active === tab.value ? '#fff' : 'var(--color-text-tertiary)',
                borderRadius: 'var(--radius-full)',
                padding: '0 6px',
                fontSize: '0.6875rem',
                fontWeight: 600,
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
