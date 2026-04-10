/**
 * Simulate async API delay
 */
export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a simple UUID
 */
export const generateId = () => {
  return 'id_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
};

/**
 * Debounce a function
 */
export const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

/**
 * Group array items by a key
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Sort array by a key
 */
export const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term across specified fields
 */
export const searchFilter = (arr, searchTerm, fields) => {
  if (!searchTerm) return arr;
  const term = searchTerm.toLowerCase();
  return arr.filter((item) =>
    fields.some((field) => {
      const value = typeof field === 'function' ? field(item) : item[field];
      return value && String(value).toLowerCase().includes(term);
    })
  );
};

/**
 * Paginate an array
 */
export const paginate = (arr, page = 1, perPage = 10) => {
  const start = (page - 1) * perPage;
  return {
    data: arr.slice(start, start + perPage),
    total: arr.length,
    totalPages: Math.ceil(arr.length / perPage),
    page,
    perPage,
  };
};

/**
 * Get color class based on a percentage or value
 */
export const getStatusColor = (value, thresholds = { danger: 25, warning: 50, success: 75 }) => {
  if (value <= thresholds.danger) return 'danger';
  if (value <= thresholds.warning) return 'warning';
  return 'success';
};

/**
 * Clamp a number between min and max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
