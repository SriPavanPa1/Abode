import React from 'react';
import { Building2, Users, Wallet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ROLES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import apartments from '../../api/mockData/apartments.json';
import maintenanceData from '../../api/mockData/maintenance.json';
import complaintsData from '../../api/mockData/complaints.json';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { switchApartment } = useAuthStore();
  const { t } = useSettingsStore();
  return (
    <PageWrapper title={t('globalOverview')} subtitle={t('manageAllApartments')}>
      <div className="grid-stats anim-slide-up" style={{ marginBottom: 'var(--space-8)' }}>
        {[
          { label: t('totalApartments'), value: apartments.length, icon: Building2, gradient: 'var(--gradient-card-1)' },
          { label: t('totalFlats'), value: apartments.reduce((s, a) => s + a.total_flats, 0), icon: Building2, gradient: 'var(--gradient-card-4)' },
          { label: t('registeredResidents'), value: apartments.reduce((s, a) => s + a.registered_residents, 0), icon: Users, gradient: 'var(--gradient-card-2)' },
          { label: t('overallOccupancy'), value: '81%', icon: TrendingUp, gradient: 'var(--gradient-card-3)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`stat-card anim-slide-up anim-delay-${i + 1}`} style={{ background: stat.gradient }}>
              <div className="stat-card__icon"><Icon size={22} /></div>
              <div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xl)' }}>{t('yourApartments')}</h2>
        <div className="grid-cards">
          {apartments.map((apt, i) => (
            <div
              key={apt.id}
              className={`card card--interactive anim-slide-up anim-delay-${i + 3}`}
              onClick={() => { switchApartment(apt.id); navigate('/dashboard'); }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <Building2 size={22} />
                </div>
                <Badge variant="success">{t('active')}</Badge>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>{apt.name}</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{apt.address}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                {[
                  { label: t('flats'), value: apt.total_flats },
                  { label: t('residents'), value: apt.registered_residents },
                  { label: t('blocks'), value: apt.total_blocks },
                ].map((s) => (
                  <div key={s.label} style={{ background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function AdminDashboard({ aptId }) {
  const navigate = useNavigate();
  const { t } = useSettingsStore();
  const apt = apartments.find((a) => a.id === aptId) || apartments[0];
  const aptMaintenance = maintenanceData.filter((m) => m.apartment_id === (aptId || 'apt1'));
  const aptComplaints = complaintsData.filter((c) => c.apartment_id === (aptId || 'apt1'));
  const paid = aptMaintenance.filter((m) => m.status === 'paid').length;
  const pending = aptMaintenance.filter((m) => m.status === 'pending' || m.status === 'overdue').length;
  const openComplaints = aptComplaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length;

  const stats = [
    { label: t('totalFlats'), value: apt.total_flats, icon: Building2, gradient: 'var(--gradient-card-1)' },
    { label: t('registeredResidents'), value: apt.registered_residents, icon: Users, gradient: 'var(--gradient-card-4)' },
    { label: t('pendingMaintenance'), value: pending, icon: Wallet, gradient: 'var(--gradient-card-3)' },
    { label: t('activeComplaints'), value: openComplaints, icon: TrendingUp, gradient: 'var(--gradient-card-2)' },
  ];

  return (
    <PageWrapper title={t('dashboard')} subtitle={apt.name}>
      <div className="grid-stats" style={{ marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`stat-card anim-slide-up anim-delay-${i + 1}`} style={{ background: stat.gradient }}>
              <div className="stat-card__icon"><Icon size={22} /></div>
              <div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        <Card header={t('maintenanceSummary')} headerAction={<Button size="sm" variant="ghost" onClick={() => navigate('/expenses')}>{t('viewAll')}</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { label: t('paid'), count: paid, color: 'var(--color-success)', pct: Math.round((paid / (paid + pending || 1)) * 100) },
              { label: t('pendingOverdue'), count: pending, color: 'var(--color-warning)', pct: Math.round((pending / (paid + pending || 1)) * 100) },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{item.count}</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-bg-primary)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card header={t('recentComplaints')} headerAction={<Button size="sm" variant="ghost" onClick={() => navigate('/complaints')}>{t('viewAll')}</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {aptComplaints.slice(0, 4).map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-surface-border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{c.raised_by_name}</div>
                </div>
                <Badge variant={c.status === 'open' ? 'danger' : c.status === 'in_progress' ? 'warning' : 'success'}>
                  {c.status === 'open' ? t('open') : c.status === 'in_progress' ? t('inProgress') : t('resolved')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card header={t('quickActions')}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {[
            { label: t('createNotice'), path: '/notices/create', variant: 'primary' },
            { label: t('viewExpenses'), path: '/expenses', variant: 'secondary' },
            { label: t('visitorLog'), path: '/visitors', variant: 'secondary' },
            { label: t('residentDirectory'), path: '/directory', variant: 'secondary' },
          ].map((action) => (
            <Button key={action.label} variant={action.variant} size="sm" onClick={() => navigate(action.path)}>
              {action.label}
            </Button>
          ))}
        </div>
      </Card>
    </PageWrapper>
  );
}

function ResidentDashboard({ user }) {
  const navigate = useNavigate();
  const { t } = useSettingsStore();
  const myMaintenance = maintenanceData.filter((m) => m.flat_id === user.flat_id);
  const myComplaints = complaintsData.filter((c) => c.flat_id === user.flat_id);
  const pendingAmt = myMaintenance.filter((m) => m.status === 'pending' || m.status === 'overdue').reduce((s, m) => s + m.amount, 0);

  return (
    <PageWrapper title={t('myDashboard')} subtitle={t('welcomeBackShort')}>
      <div className="grid-stats" style={{ marginBottom: 'var(--space-8)' }}>
        {[
          { label: t('pendingAmount'), value: formatCurrency(pendingAmt), icon: Wallet, gradient: 'var(--gradient-card-3)' },
          { label: t('myComplaints'), value: myComplaints.length, icon: TrendingUp, gradient: 'var(--gradient-card-2)' },
          { label: t('paidThisYear'), value: myMaintenance.filter((m) => m.status === 'paid').length, icon: Building2, gradient: 'var(--gradient-card-4)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`stat-card anim-slide-up anim-delay-${i + 1}`} style={{ background: stat.gradient }}>
              <div className="stat-card__icon"><Icon size={22} /></div>
              <div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        <Card header={t('myMaintenance')} headerAction={<Button size="sm" variant="ghost" onClick={() => navigate('/expenses')}>{t('viewAll')}</Button>}>
          {myMaintenance.slice(0, 4).map((m) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-surface-border)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{m.month}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{t('dueDate')}: {m.due_date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{formatCurrency(m.amount)}</div>
                <Badge variant={m.status === 'paid' ? 'success' : m.status === 'overdue' ? 'danger' : 'warning'}>{t(m.status === 'paid' ? 'paid' : m.status === 'overdue' ? 'pending' : 'pending')}</Badge>
              </div>
            </div>
          ))}
        </Card>

        <Card header={t('myComplaints')} headerAction={<Button size="sm" variant="ghost" onClick={() => navigate('/complaints')}>{t('viewAll')}</Button>}>
          {myComplaints.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('noComplaintsFiled')}</p>
          ) : myComplaints.map((c) => (
            <div key={c.id} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-surface-border)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 4 }}>{c.title}</div>
              <Badge variant={c.status === 'open' ? 'danger' : c.status === 'in_progress' ? 'warning' : 'success'}>
                {c.status === 'open' ? t('open') : c.status === 'in_progress' ? t('inProgress') : t('resolved')}
              </Badge>
            </div>
          ))}
          <Button size="sm" variant="outline" style={{ marginTop: 'var(--space-4)', width: '100%' }} onClick={() => navigate('/complaints/create')}>
            {t('newComplaint')}
          </Button>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  if (user?.role === ROLES.SUPER_ADMIN) return <SuperAdminDashboard />;
  if (user?.role === ROLES.RESIDENT) return <ResidentDashboard user={user} />;
  return <AdminDashboard aptId={user?.apartment_id} />;
}
