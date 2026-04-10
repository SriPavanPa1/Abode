import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr, fmt = 'MMM dd, yyyy') => {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '—';
  return format(date, fmt);
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '—';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '…';
};

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format a flat number with block
 */
export const formatFlatNumber = (block, flat) => {
  return `${block}-${flat}`;
};
