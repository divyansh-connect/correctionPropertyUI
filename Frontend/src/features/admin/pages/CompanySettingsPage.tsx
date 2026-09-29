import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Sparkles, Save, Edit3, CheckCircle2, X } from 'lucide-react';
import { useCompanyStore } from '../../../store/useStore';

export const CompanySettingsPage: React.FC = () => {
  const { companyName, companyAddress, timezone, currency, setCompanyProfile } = useCompanyStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(companyName);
  const [address, setAddress] = useState(companyAddress);
  const [tz, setTz] = useState(timezone);
  const [curr, setCurr] = useState(currency);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state with global store
  useEffect(() => {
    setName(companyName);
    setAddress(companyAddress);
    setTz(timezone);
    setCurr(currency);
  }, [companyName, companyAddress, timezone, currency]);

  // Sync with API backend if available
  useQuery({
    queryKey: ['company-settings-data'],
    queryFn: async () => {
      try {
        const res = await api.settings.getGeneral();
        if (res?.companyName && !localStorage.getItem('company_name')) {
          setCompanyProfile({
            companyName: res.companyName,
            companyAddress: res.address || address,
            timezone: res.timezone || tz,
            currency: res.currency || curr,
          });
        }
        return res;
      } catch (e) {
        return null;
      }
    },
  });

  const handleSave = async () => {
    // 1. Update global store & localStorage instantly
    setCompanyProfile({
      companyName: name,
      companyAddress: address,
      timezone: tz,
      currency: curr,
    });

    // 2. Persist to API backend
    try {
      await api.settings.updateGeneral({
        companyName: name,
        address,
        timezone: tz,
        currency: curr,
      });
    } catch (e) {
      // Local store updated
    }

    setIsEditing(false);
    setNotification(`Company Profile saved! Company Name updated to "${name}".`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCancel = () => {
    setName(companyName);
    setAddress(companyAddress);
    setTz(timezone);
    setCurr(currency);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Configure default branding logo assets, regional date format templates, timezone offsets, and currency types."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Company Profile' }]}
      />

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 max-w-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* GENERAL CONFIGURATIONS */}
      <div className="bg-card border border-border p-6 rounded-2xl max-w-2xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Corporate Settings & Profile
          </h3>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold flex items-center gap-1.5 h-8 border-primary/40 text-primary hover:bg-primary/5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </Button>
          ) : (
            <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              Editing Mode Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">Company Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted/40 text-muted-foreground font-medium border-border/60 opacity-80 cursor-not-allowed select-none' : 'bg-background font-bold border-primary focus:ring-2 focus:ring-primary'}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">Corporate Headquarters Address</label>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted/40 text-muted-foreground font-medium border-border/60 opacity-80 cursor-not-allowed select-none' : 'bg-background font-bold border-primary focus:ring-2 focus:ring-primary'}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">System Timezone</label>
            <Select 
              value={tz} 
              onChange={(e) => setTz(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted/40 text-muted-foreground font-medium border-border/60 opacity-80 cursor-not-allowed select-none' : 'bg-background font-bold border-primary'}
            >
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
              <option value="GMT">GMT (Greenwich Mean Time)</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">Base Currency</label>
            <Select 
              value={curr} 
              onChange={(e) => setCurr(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted/40 text-muted-foreground font-medium border-border/60 opacity-80 cursor-not-allowed select-none' : 'bg-background font-bold border-primary'}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </Select>
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 border-t border-border/80 flex items-center justify-end gap-2 animate-fade-in">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-primary text-primary-foreground font-bold flex items-center gap-1.5 text-xs"
            >
              <Save className="w-3.5 h-3.5" /> Save Configurations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySettingsPage;
