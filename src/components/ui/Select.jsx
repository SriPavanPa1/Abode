import React from 'react';

export default function Select({ label, error, options = [], className = '', id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className="form-select" {...props}>
        {options.map((opt) => (
          <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
