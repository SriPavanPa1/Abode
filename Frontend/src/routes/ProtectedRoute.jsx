import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: 'var(--space-4)',
      }}>
        <div style={{ fontSize: 64, opacity: 0.3 }}>🔒</div>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--color-text-tertiary)' }}>
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn btn--secondary btn--md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
}
