import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import { paginate } from '../../utils/helpers';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'No data found',
  emptyDescription = '',
  perPage = 10,
  actions,
}) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  let sortedData = [...data];
  if (sortField) {
    sortedData.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const { data: pageData, total, totalPages } = paginate(sortedData, page, perPage);

  const skeletonRows = Array.from({ length: 5 });

  return (
    <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-surface-border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  {col.sortable ? (
                    <button className="data-table__sortable" onClick={() => handleSort(col.key)}>
                      {col.label}
                      {sortField === col.key ? (
                        sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : (
                        <ChevronDown size={12} style={{ opacity: 0.3 }} />
                      )}
                    </button>
                  ) : col.label}
                </th>
              ))}
              {actions && <th style={{ width: 60 }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              skeletonRows.map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <div className="skeleton skeleton--text" style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                  {actions && <td><div className="skeleton skeleton--text" style={{ width: 40 }} /></td>}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="pagination__info">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
          </span>
          <div className="pagination__buttons">
            <button
              className="pagination__btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{ opacity: page === 1 ? 0.4 : 1 }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            <button
              className="pagination__btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={{ opacity: page === totalPages ? 0.4 : 1 }}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
