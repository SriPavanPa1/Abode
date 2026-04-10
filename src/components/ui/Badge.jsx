import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '', dot = false }) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {dot && <span className="status-dot" style={{ background: 'currentColor' }} />}
      {children}
    </span>
  );
}
