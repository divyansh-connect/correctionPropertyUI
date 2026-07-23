import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Sparkles, Save, ShieldAlert } from 'lucide-react';

export const CompanySettingsPage: React.FC = () => {
  const [name, setName] = useState('Apex Properties Inc.');
  const [timezone, setTimezone] = useState('EST');
  const [currency, setCurrency] = useState('USD');

  const { data: currentSettings } = useQuery({
    queryKey: ['company-settings-data'],
    queryFn: async () => {
      const res = await api.settings.getGeneral();
      setName(res.companyName);
      return res;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.settings.updateGeneral(data),
    onSuccess: () => {
      alert('Company configurations updated successfully!');
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Settings"
        description="Configure default branding logo assets, regional date format templates, timezone offsets, and currency types."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Company Settings' }]}
      />

      <div className="bg-card border border-border p-6 rounded-2xl max-w-2xl space-y-6 shadow-sm">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border pb-2">
          <Sparkles className="w-4 h-4 text-primary" /> Corporate Settings & Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Company Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Corporate Headquarters Address</label>
            <Input defaultValue="100 Pine Street, San Francisco, CA" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">System Timezone</label>
            <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
              <option value="GMT">GMT (Greenwich Mean Time)</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Base Currency</label>
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t border-border/80 flex justify-end">
          <Button onClick={() => updateMutation.mutate({ companyName: name })} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Configurations
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CompanySettingsPage;
