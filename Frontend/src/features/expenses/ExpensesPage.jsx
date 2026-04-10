import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import useExpenseStore from '../../store/expenseStore';
import useAuthStore from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import SearchBar from '../../components/ui/SearchBar';
import Tabs from '../../components/ui/Tabs';
import { ROLES, PAYMENT_STATUS, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate, formatFlatNumber } from '../../utils/formatters';
import { searchFilter } from '../../utils/helpers';
import blocks from '../../api/mockData/blocks.json';
import flats from '../../api/mockData/flats.json';
import usersData from '../../api/mockData/users.json';
import residentsData from '../../api/mockData/residents.json';

const CATEGORIES = ['Security', 'Electricity', 'Water', 'Cleaning', 'Maintenance', 'Garden', 'Repairs', 'Other'];

export default function ExpensesPage() {
  const { user } = useAuthStore();
  const { maintenance, expenses, isLoading, fetchMaintenance, fetchMaintenanceByFlat, fetchExpenses, updateMaintenanceStatus, addExpense, filters, setFilter } = useExpenseStore();
  const [activeTab, setActiveTab] = useState('maintenance');
  const [search, setSearch] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expForm, setExpForm] = useState({ category: 'Security', description: '', amount: '', month: '' });
  const navigate = useNavigate();

  const isAdmin = [ROLES.ADMIN, ROLES.MANAGER].includes(user?.role);
  const aptId = user?.apartment_id || 'apt1';
  const aptBlocks = blocks.filter((b) => b.apartment_id === aptId);

  useEffect(() => {
    if (isAdmin) {
      fetchMaintenance(aptId);
      fetchExpenses(aptId);
    } else {
      fetchMaintenanceByFlat(user?.flat_id);
    }
  }, [aptId]);

  // Enrich maintenance with flat/resident info
  const enrichedMaintenance = maintenance.map((m) => {
    const flat = flats.find((f) => f.id === m.flat_id);
    const resident = residentsData.find((r) => r.flat_id === m.flat_id);
    const resUser = resident ? usersData.find((u) => u.id === resident.user_id) : null;
    const block = flat ? blocks.find((b) => b.id === flat.block_id) : null;
    return { ...m, flat_number: flat?.flat_number || '—', block_name: block?.name || '—', resident_name: resUser?.name || 'Vacant', bhk: flat?.bhk || '—' };
  });

  const filtered = enrichedMaintenance
    .filter((m) => filters.block === 'all' || m.block_name === filters.block)
    .filter((m) => filters.status === 'all' || m.status === filters.status)
    .filter((m) => filters.month === 'all' || m.month === filters.month);
  const searched = searchFilter(filtered, search, ['flat_number', 'resident_name', 'block_name']);

  const totalCollected = enrichedMaintenance.filter((m) => m.status === 'paid').reduce((s, m) => s + m.amount, 0);
  const totalPending = enrichedMaintenance.filter((m) => m.status !== 'paid').reduce((s, m) => s + m.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const maintenanceCols = [
    { key: 'flat_number', label: 'Flat', sortable: true },
    { key: 'block_name', label: 'Block', sortable: true },
    { key: 'resident_name', label: 'Resident', sortable: true },
    { key: 'month', label: 'Month', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (v) => formatCurrency(v) },
    { key: 'due_date', label: 'Due Date', render: (v) => formatDate(v) },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={PAYMENT_STATUS_COLORS[v]}>{PAYMENT_STATUS_LABELS[v] || v}</Badge>
    },
  ];

  const expenseCols = [
    { key: 'category', label: 'Category', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', sortable: true, render: (v) => formatCurrency(v) },
    { key: 'month', label: 'Month', sortable: true },
    { key: 'date', label: 'Date', render: (v) => formatDate(v) },
  ];

  const uniqueMonths = [...new Set(enrichedMaintenance.map((m) => m.month))];

  const handleMarkPaid = async (row) => {
    await updateMaintenanceStatus(row.id, PAYMENT_STATUS.PAID);
    toast.success(`Flat ${row.flat_number} marked as paid`);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await addExpense({ ...expForm, amount: Number(expForm.amount), apartment_id: aptId, date: new Date().toISOString().slice(0, 10), approved_by: user.id });
    toast.success('Expense added');
    setShowAddExpense(false);
    setExpForm({ category: 'Security', description: '', amount: '', month: '' });
  };

  return (
    <PageWrapper
      title="Expenses & Maintenance"
      subtitle="Track payment status and society expenses"
      actions={isAdmin && (
        <>
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAddExpense(true)}>Add Expense</Button>
        </>
      )}
    >
      {/* Summary cards */}
      {isAdmin && (
        <div className="grid-stats anim-slide-up" style={{ marginBottom: 'var(--space-8)' }}>
          {[
            { label: 'Collected', value: formatCurrency(totalCollected), gradient: 'var(--gradient-card-4)' },
            { label: 'Pending', value: formatCurrency(totalPending), gradient: 'var(--gradient-card-3)' },
            { label: 'Total Expenses', value: formatCurrency(totalExpenses), gradient: 'var(--gradient-card-1)' },
            { label: 'Net Balance', value: formatCurrency(totalCollected - totalExpenses), gradient: 'var(--gradient-card-2)' },
          ].map((s, i) => (
            <div key={i} className={`stat-card anim-delay-${i + 1}`} style={{ background: s.gradient, minHeight: 100 }}>
              <div className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <Tabs
        tabs={[
          { label: 'Maintenance', value: 'maintenance', count: maintenance.length },
          ...(isAdmin ? [{ label: 'Expenses', value: 'expenses', count: expenses.length }] : []),
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'maintenance' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            <SearchBar onSearch={setSearch} placeholder="Search flat, resident…" style={{ width: 260 }} />
            {isAdmin && (
              <>
                <select className="form-select" style={{ height: 40, padding: '0 36px 0 12px' }} value={filters.block} onChange={(e) => setFilter('block', e.target.value)}>
                  <option value="all">All Blocks</option>
                  {aptBlocks.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
                <select className="form-select" style={{ height: 40, padding: '0 36px 0 12px' }} value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
                  <option value="all">All Status</option>
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select className="form-select" style={{ height: 40, padding: '0 36px 0 12px' }} value={filters.month} onChange={(e) => setFilter('month', e.target.value)}>
                  <option value="all">All Months</option>
                  {uniqueMonths.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </>
            )}
          </div>
          <DataTable
            columns={maintenanceCols}
            data={searched}
            isLoading={isLoading}
            emptyTitle="No maintenance records"
            actions={isAdmin ? (row) => (
              row.status !== 'paid' && (
                <Button size="sm" variant="outline" onClick={() => handleMarkPaid(row)}>Mark Paid</Button>
              )
            ) : null}
          />
        </>
      )}

      {activeTab === 'expenses' && isAdmin && (
        <DataTable
          columns={expenseCols}
          data={expenses}
          isLoading={isLoading}
          emptyTitle="No expenses recorded"
        />
      )}

      {/* Add Expense Modal */}
      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add New Expense">
        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select label="Category" value={expForm.category} onChange={(e) => setExpForm({ ...expForm, category: e.target.value })} options={CATEGORIES} />
          <Input label="Description" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} required />
          <Input label="Amount (₹)" type="number" value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })} required />
          <Input label="Month (YYYY-MM)" value={expForm.month} onChange={(e) => setExpForm({ ...expForm, month: e.target.value })} placeholder="2026-04" required />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowAddExpense(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Expense</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
