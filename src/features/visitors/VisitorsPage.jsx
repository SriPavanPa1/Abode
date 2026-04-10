import React, { useEffect, useState } from 'react';
import { Plus, LogOut, Package, Car, Wrench, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useVisitorStore from '../../store/visitorStore';
import useAuthStore from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Tabs from '../../components/ui/Tabs';
import { formatRelativeTime, formatPhone } from '../../utils/formatters';
import { VISITOR_TYPE, VISITOR_STATUS } from '../../utils/constants';
import flatsData from '../../api/mockData/flats.json';

const TYPE_ICONS = {
  visitor: UserCheck,
  delivery: Package,
  cab: Car,
  service: Wrench,
};

const TYPE_COLORS = {
  visitor: 'accent',
  delivery: 'info',
  cab: 'warning',
  service: 'neutral',
};

const STATUS_COLORS = {
  checked_in: 'success',
  checked_out: 'neutral',
  expected: 'warning',
};

const STATUS_LABELS = {
  checked_in: 'In',
  checked_out: 'Out',
  expected: 'Expected',
};

export default function VisitorsPage() {
  const { user } = useAuthStore();
  const { visitors, isLoading, fetchVisitors, addVisitor, markExit, approveEntry, typeFilter, setTypeFilter } = useVisitorStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ visitor_name: '', phone: '', type: 'visitor', purpose: '', flat_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aptId = user?.apartment_id || 'apt1';
  const aptFlats = flatsData.filter((f) => f.apartment_id === aptId && f.status === 'occupied');

  useEffect(() => { fetchVisitors(aptId); }, [aptId]);

  const filtered = typeFilter === 'all' ? visitors : visitors.filter((v) => v.type === typeFilter);

  const typeCounts = Object.values(VISITOR_TYPE).reduce((acc, t) => {
    acc[t] = visitors.filter((v) => v.type === t).length;
    return acc;
  }, {});

  const tabs = [
    { label: 'All', value: 'all', count: visitors.length },
    ...Object.entries(VISITOR_TYPE).map(([, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count: typeCounts[value] || 0,
    })),
  ];

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addVisitor({ ...form, apartment_id: aptId, approved_by: user.id });
      toast.success('Visitor entry logged!');
      setShowAdd(false);
      setForm({ visitor_name: '', phone: '', type: 'visitor', purpose: '', flat_id: '' });
    } catch { toast.error('Failed to add visitor'); }
    setIsSubmitting(false);
  };

  const handleMarkExit = async (id) => {
    await markExit(id);
    toast.success('Exit recorded');
  };

  const handleApprove = async (id) => {
    await approveEntry(id, user.id);
    toast.success('Entry approved');
  };

  const columns = [
    {
      key: 'visitor_name', label: 'Visitor',
      render: (v, row) => {
        const Icon = TYPE_ICONS[row.type] || UserCheck;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>
              <Icon size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{v}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{formatPhone(row.phone)}</div>
            </div>
          </div>
        );
      },
    },
    { key: 'type', label: 'Type', render: (v) => <Badge variant={TYPE_COLORS[v]}>{v}</Badge> },
    { key: 'purpose', label: 'Purpose' },
    {
      key: 'checked_in_at', label: 'Entry',
      render: (v) => v ? formatRelativeTime(v) : '—',
    },
    {
      key: 'checked_out_at', label: 'Exit',
      render: (v) => v ? formatRelativeTime(v) : '—',
    },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={STATUS_COLORS[v]} dot>{STATUS_LABELS[v]}</Badge>
    },
  ];

  return (
    <PageWrapper
      title="Visitor Logs"
      subtitle="Track all visitors, deliveries, and service personnel"
      actions={
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAdd(true)}>
          Add Entry
        </Button>
      }
    >
      {/* Today's summary */}
      <div className="grid-stats anim-slide-up" style={{ marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Currently Inside', value: visitors.filter((v) => v.status === 'checked_in').length, color: 'var(--gradient-card-4)' },
          { label: 'Expected', value: visitors.filter((v) => v.status === 'expected').length, color: 'var(--gradient-card-3)' },
          { label: 'Total Today', value: visitors.filter((v) => v.checked_in_at?.startsWith(new Date().toISOString().slice(0, 10))).length, color: 'var(--gradient-card-1)' },
          { label: 'Deliveries', value: visitors.filter((v) => v.type === 'delivery').length, color: 'var(--gradient-card-2)' },
        ].map((s, i) => (
          <div key={i} className={`stat-card anim-delay-${i + 1}`} style={{ background: s.color, minHeight: 100 }}>
            <div className="stat-card__value" style={{ fontSize: 'var(--font-size-3xl)' }}>{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      <Tabs tabs={tabs} active={typeFilter} onChange={setTypeFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyTitle="No visitors logged"
        actions={(row) => (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {row.status === 'expected' && (
              <Button size="sm" variant="outline" onClick={() => handleApprove(row.id)}>Approve</Button>
            )}
            {row.status === 'checked_in' && (
              <Button size="sm" variant="secondary" icon={LogOut} onClick={() => handleMarkExit(row.id)}>Exit</Button>
            )}
          </div>
        )}
      />

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Log Visitor Entry">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Visitor Name" value={form.visitor_name} onChange={(e) => setForm({ ...form, visitor_name: e.target.value })} placeholder="Full name" required />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" />
          <div className="grid-2">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              options={Object.values(VISITOR_TYPE).map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))}
            />
            <Select
              label="Flat"
              value={form.flat_id}
              onChange={(e) => setForm({ ...form, flat_id: e.target.value })}
              options={[{ value: '', label: 'Select flat…' }, ...aptFlats.map((f) => ({ value: f.id, label: f.flat_number }))]}
            />
          </div>
          <Input label="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Purpose of visit" required />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>Log Entry</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
