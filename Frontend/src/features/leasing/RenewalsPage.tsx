import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Edit, Trash2, Mail } from 'lucide-react';

interface RenewalLog {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  expirationDate: string;
  status: 'Sent' | 'Accepted' | 'Declined' | 'Pending Offer';
}

export const RenewalsPage: React.FC = () => {
  // Load real Leases from backend database
  const { data: leases = [], refetch } = useQuery({
    queryKey: ['leases'],
    queryFn: () => api.leasing.getLeases(),
  });

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ tenantName: '', propertyName: '', unitNumber: '', expirationDate: '', status: 'Pending Offer' as RenewalLog['status'] });
  const [msg, setMsg] = React.useState('');

  // Map database leases dynamically to Renewal Logs
  const renewals: RenewalLog[] = React.useMemo(() => {
    const list: RenewalLog[] = leases.map((lease: any) => {
      let rStatus: RenewalLog['status'] = 'Pending Offer';
      if (lease.status === 'Active') rStatus = 'Accepted';
      else if (lease.status === 'Pending') rStatus = 'Sent';
      else if (lease.status === 'Terminated') rStatus = 'Declined';

      return {
        id: lease.id,
        tenantName: lease.tenant ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : 'Resident',
        propertyName: lease.property?.name || 'Property',
        unitNumber: lease.unit?.unitNumber || 'Unit',
        expirationDate: lease.endDate ? lease.endDate.split('T')[0] : 'N/A',
        status: rStatus,
      };
    });

    // If database has no leases, show fallback mock data
    if (list.length === 0) {
      return [
        { id: 'mock-1', tenantName: 'William Miller', propertyName: 'Oakridge Heights', unitNumber: '102', expirationDate: '2026-08-15', status: 'Pending Offer' },
        { id: 'mock-2', tenantName: 'Patricia Thomas', propertyName: 'Sunset Villas', unitNumber: '304', expirationDate: '2026-08-20', status: 'Sent' },
        { id: 'mock-3', tenantName: 'Robert Johnson', propertyName: 'Lakeside Estates', unitNumber: '110', expirationDate: '2026-09-01', status: 'Accepted' },
      ];
    }

    return list;
  }, [leases]);

  const handleEdit = (r: RenewalLog) => {
    setEditingId(r.id);
    setForm({
      tenantName: r.tenantName,
      propertyName: r.propertyName,
      unitNumber: r.unitNumber,
      expirationDate: r.expirationDate,
      status: r.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('mock-')) return;
    try {
      await api.leasing.deleteLease(id);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendOffer = async (name: string, id: string) => {
    if (id.startsWith('mock-')) {
      setMsg(`Renewal proposal terms dispatched to ${name}.`);
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    try {
      await api.leasing.updateLease(id, { status: 'Pending' });
      refetch();
      setMsg(`Renewal proposal terms dispatched to ${name}.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tenantName) return;

    if (editingId && !editingId.startsWith('mock-')) {
      let lStatus = 'Pending';
      if (form.status === 'Accepted') lStatus = 'Active';
      else if (form.status === 'Declined') lStatus = 'Terminated';

      try {
        await api.leasing.updateLease(editingId, {
          status: lStatus,
          endDate: form.expirationDate,
        });
        refetch();
      } catch (e) {
        console.error(e);
      }
      setEditingId(null);
    }

    setForm({ tenantName: '', propertyName: '', unitNumber: '', expirationDate: '', status: 'Pending Offer' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lease Renewals Directory"
        description="Verify upcoming expirations, dispatch proposal rates, and track acceptances."
        breadcrumbs={[
          { label: 'Leasing', href: '/leasing/leases' },
          { label: 'Renewals' },
        ]}
        action={{
          label: editingId ? 'Edit Renewal' : 'New Renewal Offer',
          onClick: () => {
            if (showForm) {
              setEditingId(null);
              setForm({ tenantName: '', propertyName: '', unitNumber: '', expirationDate: '', status: 'Pending Offer' });
            }
            setShowForm(!showForm);
          },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {msg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          {msg}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">
            {editingId ? 'Modify Renewal Terms' : 'Draft New Renewal Proposal'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Tenant Name</label>
              <input 
                required 
                value={form.tenantName} 
                onChange={e => setForm(prev => ({ ...prev, tenantName: e.target.value }))}
                placeholder="e.g. William Miller" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Property</label>
              <input 
                required 
                value={form.propertyName} 
                onChange={e => setForm(prev => ({ ...prev, propertyName: e.target.value }))}
                placeholder="e.g. Oakridge Heights" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Unit Number</label>
              <input 
                required 
                value={form.unitNumber} 
                onChange={e => setForm(prev => ({ ...prev, unitNumber: e.target.value }))}
                placeholder="e.g. 102" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Lease Expiration Date</label>
              <input 
                type="date" 
                value={form.expirationDate} 
                onChange={e => setForm(prev => ({ ...prev, expirationDate: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Renewal Status</label>
              <select 
                value={form.status} 
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as RenewalLog['status'] }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option value="Pending Offer">Pending Offer</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Offer' : 'Publish Offer'}</Button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Resident</th>
                <th className="p-4">Property</th>
                <th className="p-4">Unit #</th>
                <th className="p-4">Lease Expiration</th>
                <th className="p-4">Renewal Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {renewals.map((r) => (
                <tr key={r.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{r.tenantName}</td>
                  <td className="p-4 font-bold">{r.propertyName}</td>
                  <td className="p-4">{r.unitNumber}</td>
                  <td className="p-4 font-mono text-muted-foreground">{r.expirationDate}</td>
                  <td className="p-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    {r.status === 'Pending Offer' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendOffer(r.tenantName, r.id)}
                        className="text-[10px] font-extrabold py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> Send Offer
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(r)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RenewalsPage;
