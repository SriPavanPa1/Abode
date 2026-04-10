import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Megaphone, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useNoticeStore from '../../store/noticeStore';
import useAuthStore from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import { ROLES, NOTICE_CATEGORY, NOTICE_CATEGORY_LABELS, NOTICE_CATEGORY_COLORS } from '../../utils/constants';
import { formatRelativeTime, formatDate } from '../../utils/formatters';

const CATEGORY_OPTIONS = Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export default function NoticesPage() {
  const { user } = useAuthStore();
  const { notices, isLoading, fetchNotices, createNotice, deleteNotice, categoryFilter, setCategoryFilter } = useNoticeStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: NOTICE_CATEGORY.GENERAL, expires_at: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPER_ADMIN].includes(user?.role);
  const aptId = user?.apartment_id || 'apt1';

  useEffect(() => { fetchNotices(aptId); }, [aptId]);

  const filtered = categoryFilter === 'all' ? notices : notices.filter((n) => n.category === categoryFilter);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createNotice({ ...form, apartment_id: aptId, posted_by: user.id, posted_by_name: user.name });
      toast.success('Notice published!');
      setShowCreate(false);
      setForm({ title: '', content: '', category: NOTICE_CATEGORY.GENERAL, expires_at: '' });
    } catch { toast.error('Failed to create notice'); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    await deleteNotice(id);
    toast.success('Notice deleted');
    if (selectedNotice?.id === id) setSelectedNotice(null);
  };

  const tabs = [
    { label: 'All', value: 'all', count: notices.length },
    ...Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({
      value, label, count: notices.filter((n) => n.category === value).length,
    })),
  ];

  return (
    <PageWrapper
      title="Notice Board"
      subtitle="Society announcements and updates"
      actions={isAdmin && (
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreate(true)}>Create Notice</Button>
      )}
    >
      <Tabs tabs={tabs} active={categoryFilter} onChange={setCategoryFilter} />

      {isLoading ? (
        <div className="grid-cards">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton--card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No notices yet"
          description="No notices have been posted in this category."
          action={isAdmin ? () => setShowCreate(true) : null}
          actionLabel={isAdmin ? 'Create Notice' : null}
        />
      ) : (
        <div className="grid-cards">
          {filtered.map((notice, i) => (
            <div
              key={notice.id}
              className={`card card--interactive anim-slide-up anim-delay-${(i % 6) + 1}`}
              onClick={() => setSelectedNotice(notice)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <Badge variant={NOTICE_CATEGORY_COLORS[notice.category]} dot>
                  {NOTICE_CATEGORY_LABELS[notice.category]}
                </Badge>
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(notice.id); }}
                    style={{ color: 'var(--color-text-muted)', padding: 4, borderRadius: 4 }}
                    aria-label="Delete notice"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-2)', lineHeight: 1.4 }}>
                {notice.title}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {notice.content}
              </p>
              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  By {notice.posted_by_name}
                </span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {formatRelativeTime(notice.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedNotice && (
        <Modal isOpen={!!selectedNotice} onClose={() => setSelectedNotice(null)} title={selectedNotice.title} maxWidth="600px">
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Badge variant={NOTICE_CATEGORY_COLORS[selectedNotice.category]}>
              {NOTICE_CATEGORY_LABELS[selectedNotice.category]}
            </Badge>
            {selectedNotice.expires_at && (
              <Badge variant="warning">Expires: {formatDate(selectedNotice.expires_at)}</Badge>
            )}
          </div>
          <p style={{ lineHeight: 1.75, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            {selectedNotice.content}
          </p>
          <div style={{ borderTop: '1px solid var(--color-surface-border)', paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Posted by <strong>{selectedNotice.posted_by_name}</strong> · {formatDate(selectedNotice.created_at, 'MMM dd, yyyy • hh:mm a')}
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Notice">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title…" required />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={CATEGORY_OPTIONS} />
          <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your notice here…" style={{ minHeight: 140 }} required />
          <Input label="Expiry Date (optional)" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>Publish Notice</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
