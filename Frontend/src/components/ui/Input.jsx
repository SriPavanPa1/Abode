import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
              display: 'flex',
            }}
          >
            <Icon size={16} />
          </span>
        )}
        <input
          id={inputId}
          className={`form-input ${error ? 'form-input--error' : ''}`}
          style={Icon ? { paddingLeft: '40px' } : {}}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
