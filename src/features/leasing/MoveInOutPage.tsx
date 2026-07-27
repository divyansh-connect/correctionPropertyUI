import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface MoveEvent {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  date: string;
  type: 'Move In' | 'Move Out';
  status: 'Scheduled' | 'Completed' | 'Pending Inspection';
}

interface MoveInOutPageProps {
  type?: 'Move In' | 'Move Out';
}

export const MoveInOutPage: React.FC<MoveInOutPageProps> = ({ type }) => {
  const { t } = useTranslation();
  const [moves, setMoves] = React.useState<MoveEvent[]>([
    { id: '1', tenantName: 'Alice Smith', propertyName: 'Oakridge Heights', unitNumber: '101', date: '2026-08-01', type: 'Move In', status: 'Scheduled' },
    { id: '2', tenantName: 'Bob Garcia', propertyName: 'Sunset Villas', unitNumber: '204', date: '2026-07-31', type: 'Move Out', status: 'Pending Inspection' },
    { id: '3', tenantName: 'Charlie Miller', propertyName: 'Lakeside Estates', unitNumber: '302', date: '2026-07-15', type: 'Move In', status: 'Completed' },
  ]);

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ tenantName: '', propertyName: '', unitNumber: '', date: '', status: 'Scheduled' as MoveEvent['status'] });

  const filteredMoves = type ? moves.filter(m => m.type === type) : moves;

  const handleEdit = (m: MoveEvent) => {
    setEditingId(m.id);
    setForm({
      tenantName: m.tenantName,
      propertyName: m.propertyName,
      unitNumber: m.unitNumber,
      date: m.date,
      status: m.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMoves(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tenantName) return;

    if (editingId) {
      setMoves(prev => prev.map(m => m.id === editingId ? {
        ...m,
        tenantName: form.tenantName,
        propertyName: form.propertyName,
        unitNumber: form.unitNumber,
        date: form.date,
        status: form.status
      } : m));
      setEditingId(null);
    } else {
      setMoves(prev => [
        ...prev,
        {
          id: String(Date.now()),
          tenantName: form.tenantName,
          propertyName: form.propertyName,
          unitNumber: form.unitNumber,
          date: form.date || new Date().toISOString().split('T')[0],
          type: type || 'Move In',
          status: form.status
        }
      ]);
    }

    setForm({ tenantName: '', propertyName: '', unitNumber: '', date: '', status: 'Scheduled' });
    setShowForm(false);
  };

  const titleText = type === 'Move In' ? t('pmLeasing.moveInTitle') : type === 'Move Out' ? t('pmLeasing.moveOutTitle') : "Move In / Move Out Inspections";
  const descText = type === 'Move In' ? t('pmLeasing.moveInDesc') : type === 'Move Out' ? t('pmLeasing.moveOutDesc') : "Verify upcoming resident move schedules, key handovers, and condition reports.";
  const actionText = type === 'Move In' ? t('pmLeasing.scheduleMoveIn') : type === 'Move Out' ? t('pmLeasing.scheduleMoveOut') : "Schedule Move";

  return (
    <div className="space-y-6">
      <PageHeader
        title={titleText}
        description={descText}
        breadcrumbs={[
          { label: t('header.home'), href: '/' },
          { label: t('nav.leasing'), href: '/leasing' },
          { label: titleText },
        ]}
        action={{
          label: editingId ? 'Edit Event' : actionText,
          onClick: () => {
            if (showForm) {
              setEditingId(null);
              setForm({ tenantName: '', propertyName: '', unitNumber: '', date: '', status: 'Scheduled' });
            }
            setShowForm(!showForm);
          },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">
            {editingId ? 'Modify Move Schedule' : `Schedule Custom New ${type || 'Move'}`}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Tenant / Resident Name</label>
              <input 
                required 
                value={form.tenantName} 
                onChange={e => setForm(prev => ({ ...prev, tenantName: e.target.value }))}
                placeholder="e.g. Alice Smith" 
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
                placeholder="e.g. 101" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Scheduled Date</label>
              <input 
                type="date" 
                required 
                value={form.date} 
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Inspection Status</label>
              <select 
                value={form.status} 
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as MoveEvent['status'] }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Pending Inspection">Pending Inspection</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Schedule' : 'Confirm Schedule'}</Button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">{t('pmLeasing.resident')}</th>
                <th className="p-4">{t('pmLeasing.property')}</th>
                <th className="p-4">{t('pmLeasing.unit')}</th>
                <th className="p-4">{t('pmLeasing.scheduledDate')}</th>
                <th className="p-4">{t('pmLeasing.type')}</th>
                <th className="p-4">{t('pmLeasing.inspectionStatus')}</th>
                <th className="p-4 text-right">{t('pmLeasing.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {filteredMoves.map((m) => (
                <tr key={m.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{m.tenantName}</td>
                  <td className="p-4 font-bold">{m.propertyName}</td>
                  <td className="p-4">{m.unitNumber}</td>
                  <td className="p-4 font-mono text-muted-foreground">{m.date}</td>
                  <td className="p-4">
                    <span className={`font-extrabold text-[10px] uppercase ${m.type === 'Move In' ? 'text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded' : 'text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
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

export default MoveInOutPage;
