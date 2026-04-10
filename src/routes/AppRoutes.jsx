import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ExpensesPage from '../features/expenses/ExpensesPage';
import NoticesPage from '../features/notices/NoticesPage';
import ComplaintsPage from '../features/complaints/ComplaintsPage';
import DirectoryPage from '../features/directory/DirectoryPage';
import VisitorsPage from '../features/visitors/VisitorsPage';
import { roleRoutes } from './roleRoutes';

function LayoutRoute({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={roleRoutes.dashboard}>
            <LayoutRoute><DashboardPage /></LayoutRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute allowedRoles={roleRoutes.expenses}>
            <LayoutRoute><ExpensesPage /></LayoutRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <ProtectedRoute allowedRoles={roleRoutes.notices}>
            <LayoutRoute><NoticesPage /></LayoutRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <ProtectedRoute allowedRoles={roleRoutes.complaints}>
            <LayoutRoute><ComplaintsPage /></LayoutRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/directory"
        element={
          <ProtectedRoute allowedRoles={roleRoutes.directory}>
            <LayoutRoute><DirectoryPage /></LayoutRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitors"
        element={
          <ProtectedRoute allowedRoles={roleRoutes.visitors}>
            <LayoutRoute><VisitorsPage /></LayoutRoute>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
