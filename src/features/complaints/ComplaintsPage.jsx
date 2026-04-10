import React, { useEffect, useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import useComplaintStore from '../../store/complaintStore';
import useAuthStore from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import {
  ROLES, COMPLAINT_STATUS, COMPLAINT_STATUS_LABELS, COMPLAINT_STATUS_COLORS,
  PRIORITY, PRIORITY_LABELS, PRIORITY_COLORS
} from '../../utils/constants';
import { formatRelativeTime, formatDate } from '../../utils/formatters';

const CATEGORIES = ['Plumbing', 'Electrical', 'Security', 'Maintenance', 'Nuisance', 'Amenities', 'Parking', 'Other'];
const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c, label: c }));

const STATUS_FLOW = {
  [COMPLAINT_STATUS.OPEN]: COMPLAINT_STATUS.IN_PROGRESS,
  [COMPLAINT_STATUS.IN_PROGRESS]: COMPLAINT_STATUS.RESOLVED,
  [COMPLAINT_STATUS.RESOLVED]: COMPLAINT_STATUS.CLOSED,
};

export default function ComplaintsPage() {
  const { user } = useAuthStore();
  const { complaints, isLoading, fetchComplaints, fetchComplaintsByFlat, createComplaint, updateStatus, statusFilter, setStatusFilter } = useComplaintStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Plumbing', priority: PRIORITY.MEDIUM });

  const isAdmin = [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPER_ADMIN].includes(user?.role);
  const aptId = user?.apartment_id || 'apt1';

  useEffect(() => {
    if (isAdmin) fetchComplaints(aptId);
    else fetchComplaintsByFlat(user?.flat_id);
  }, [aptId]);

  const filtered = statusFilter === 'all' ? complaints : complaints.filter((c) => c.status === statusFilter);

  const statusCounts = Object.values(COMPLAINT_STATUS).reduce((acc, s) => {
    acc[s] = complaints.filter((c) => c.status === s).length;
    return acc;
  }, {});

  const tabs = [
    { label: 'All', value: 'all', count: complaints.length },
    ...Object.entries(COMPLAINT_STATUS_LABELS).map(([value, label]) => ({
      value, label, count: statusCounts[value] || 0,
    })),
  ];

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      await createComplaint({
        ...form,
        apartment_id: aptId,
        flat_id: user.flat_id,
        raised_by: user.id,
        raised_by_name: user.name,
      });
      toast.success('Complaint submitted!');
      setShowCreate(false);
      setForm({ title: '', description: '', category: 'Plumbing', priority: PRIORITY.MEDIUM });
    } catch { toast.error('Failed to submit complaint'); }
  };

  const handleAdvanceStatus = async () => {
    if (!selectedComplaint) return;
    const nextStatus = STATUS_FLOW[selectedComplaint.status];
    if (!nextStatus) return;
    setIsUpdating(true);
    const updated = await updateStatus(selectedComplaint.id, nextStatus, statusNote);
    setSelectedComplaint(updated);
    setStatusNote('');
    setIsUpdating(false);
    toast.success(`Status updated to ${COMPLAINT_STATUS_LABELS[nextStatus]}`);
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true, render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'raised_by_name', label: 'Raised By' },
    {
      key: 'priority', label: 'Priority',
      render: (v) => <Badge variant={PRIORITY_COLORS[v]}>{PRIORITY_LABELS[v]}</Badge>
    },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={COMPLAINT_STATUS_COLORS[v]} dot>{COMPLAINT_STATUS_LABELS[v]}</Badge>
    },
    { key: 'created_at', label: 'Raised', render: (v) => formatRelativeTime(v) },
  ];

  return (
    <PageWrapper
      title="Complaints"
      subtitle={isAdmin ? 'Manage all society complaints' : 'Your submitted complaints'}
      actions={
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreate(true)}>
          New Complaint
        </Button>
      }
    >
      <Tabs tabs={tabs} active={statusFilter} onChange={setStatusFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyTitle="No complaints found"
        emptyDescription="No complaints match the selected filter."
        actions={(row) => (
          <Button size="sm" variant="ghost" onClick={() => setSelectedComplaint(row)}>View</Button>
        )}
      />

      {/* Detail Modal */}
      {selectedComplaint && (
        <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} title="Complaint Details" maxWidth="620px">
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Badge variant={COMPLAINT_STATUS_COLORS[selectedComplaint.status]} dot>
              {COMPLAINT_STATUS_LABELS[selectedComplaint.status]}
            </Badge>
            <Badge variant={PRIORITY_COLORS[selectedComplaint.priority]}>
              {PRIORITY_LABELS[selectedComplaint.priority]}
            </Badge>
            <Badge variant="neutral">{selectedComplaint.category}</Badge>
          </div>

          <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-lg)' }}>{selectedComplaint.title}</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>{selectedComplaint.description}</p>

          {/* Status Timeline */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Timeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {(selectedComplaint.timeline || []).map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                      {COMPLAINT_STATUS_LABELS[t.status] || t.status}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                      {formatDate(t.date, 'MMM dd, yyyy • hh:mm a')}
                    </div>
                    {t.note && <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{t.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin status advance */}
          {isAdmin && STATUS_FLOW[selectedComplaint.status] && (
            <div style={{ borderTop: '1px solid var(--color-surface-border)', paddingTop: 'var(--space-4)' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                Advance to: <Badge variant="info">{COMPLAINT_STATUS_LABELS[STATUS_FLOW[selectedComplaint.status]]}</Badge>
              </h4>
              <Textarea
                label="Status Note (optional)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Describe actions taken…"
                style={{ minHeight: 80, marginBottom: 'var(--space-3)' }}
              />
              <Button variant="primary" loading={isUpdating} onClick={handleAdvanceStatus}>
                Update Status → {COMPLAINT_STATUS_LABELS[STATUS_FLOW[selectedComplaint.status]]}
              </Button>
            </div>
          )}
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Submit New Complaint">
        <form onSubmit={handleCreateComplaint} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief description of the issue" required />
          <div className="grid-2">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={CATEGORY_OPTIONS} />
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} options={PRIORITY_OPTIONS} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail…" style={{ minHeight: 120 }} required />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Complaint</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
