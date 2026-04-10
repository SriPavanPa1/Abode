import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useHooks';

export default function SearchBar({ onSearch, placeholder = 'Search…', className = '' }) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={`search-bar ${className}`}>
      <span className="search-bar__icon">
        <Search size={16} />
      </span>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
