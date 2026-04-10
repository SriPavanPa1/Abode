import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import { ROLES } from '../../utils/constants';
import { formatPhone, getInitials } from '../../utils/formatters';
import { searchFilter } from '../../utils/helpers';
import residentsData from '../../api/mockData/residents.json';
import usersData from '../../api/mockData/users.json';
import flatsData from '../../api/mockData/flats.json';
import blocksData from '../../api/mockData/blocks.json';

export default function DirectoryPage() {
  const { user } = useAuthStore();
  const [showContacts, setShowContacts] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedResident, setSelectedResident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [residents, setResidents] = useState([]);

  const aptId = user?.apartment_id || 'apt1';

  useEffect(() => {
    setTimeout(() => {
      const enriched = residentsData
        .filter((r) => r.apartment_id === aptId)
        .map((r) => {
          const u = usersData.find((usr) => usr.id === r.user_id);
          const flat = flatsData.find((f) => f.id === r.flat_id);
          const block = flat ? blocksData.find((b) => b.id === flat.block_id) : null;
          return { ...r, name: u?.name || '—', email: u?.email || '—', phone: u?.phone || '—', flat_number: flat?.flat_number || '—', block_name: block?.name || '—', bhk: flat?.bhk || '—' };
        });
      setResidents(enriched);
      setIsLoading(false);
    }, 400);
  }, [aptId]);

  const searched = searchFilter(residents, search, ['name', 'flat_number', 'block_name']);

  const columns = [
    {
      key: 'name', label: 'Resident',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--font-size-xs)', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {getInitials(v)}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{v}</div>
            {showContacts && (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{row.email}</div>
            )}
          </div>
        </div>
      ),
    },
    { key: 'flat_number', label: 'Flat', sortable: true },
    { key: 'block_name', label: 'Block', sortable: true },
    { key: 'bhk', label: 'BHK' },
    { key: 'type', label: 'Type', render: (v) => <Badge variant={v === 'owner' ? 'accent' : 'neutral'}>{v}</Badge> },
    { key: 'family_members', label: 'Family' },
    { key: 'phone', label: 'Phone', render: (v) => showContacts ? formatPhone(v) : '••••••••••' },
  ];

  return (
    <PageWrapper
      title="Resident Directory"
      subtitle="Society resident information"
      actions={
        <Button
          variant={showContacts ? 'primary' : 'secondary'}
          size="sm"
          icon={showContacts ? Eye : EyeOff}
          onClick={() => setShowContacts(!showContacts)}
        >
          {showContacts ? 'Hide' : 'Show'} Contact Info
        </Button>
      }
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <SearchBar onSearch={setSearch} placeholder="Search by name, flat, block…" />
      </div>

      <DataTable
        columns={columns}
        data={searched}
        isLoading={isLoading}
        emptyTitle="No residents found"
        actions={(row) => (
          <Button size="sm" variant="ghost" onClick={() => setSelectedResident(row)}>View</Button>
        )}
      />

      {/* Detail Modal */}
      {selectedResident && (
        <Modal isOpen={!!selectedResident} onClose={() => setSelectedResident(null)} title="Resident Details">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#fff',
              margin: '0 auto var(--space-3)',
            }}>{getInitials(selectedResident.name)}</div>
            <h3 style={{ marginBottom: 4 }}>{selectedResident.name}</h3>
            <Badge variant={selectedResident.type === 'owner' ? 'accent' : 'neutral'}>{selectedResident.type}</Badge>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {[
              { label: 'Flat', value: selectedResident.flat_number },
              { label: 'Block', value: selectedResident.block_name },
              { label: 'BHK', value: selectedResident.bhk },
              { label: 'Family Members', value: selectedResident.family_members },
              { label: 'Move-in Date', value: selectedResident.move_in_date },
              { label: 'Vehicle', value: selectedResident.vehicle_number || '—' },
              { label: 'Phone', value: showContacts ? formatPhone(selectedResident.phone) : '••••••••••' },
              { label: 'Email', value: showContacts ? selectedResident.email : '•••••@•••.com' },
              { label: 'Emergency Contact', value: showContacts ? formatPhone(selectedResident.emergency_contact) : '••••••••••' },
            ].map((field) => (
              <div key={field.label}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{field.value || '—'}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
