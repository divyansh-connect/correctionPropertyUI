import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Sparkles, Save, Mail, MessageSquare } from 'lucide-react';

export const PaymentSettingsPage: React.FC = () => {
  const [emailPref, setEmailPref] = useState(true);
  const [smsPref, setSmsPref] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('auto_deliver_email');
    const savedSms = localStorage.getItem('auto_deliver_sms');
    if (savedEmail !== null) setEmailPref(savedEmail === 'true');
    if (savedSms !== null) setSmsPref(savedSms === 'true');
  }, []);

  const handleSaveCredentials = () => {
    alert('Payment Gateway credentials updated successfully!');
  };

  const handleSaveDeliveryPrefs = () => {
    localStorage.setItem('auto_deliver_email', String(emailPref));
    localStorage.setItem('auto_deliver_sms', String(smsPref));
    setSavedMsg('Invoice delivery options updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Payment Settings"
        description="Integrate merchant accounts, configure webhook listeners, and select sandbox or production run environments."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Payment Settings' }]}
      />

      {savedMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold max-w-2xl">
          {savedMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Gateway Credentials */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Sparkles className="w-4 h-4 text-primary" /> Merchant Gateway Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-muted-foreground uppercase text-[10px]">Environment Mode</label>
              <Select defaultValue="sandbox">
                <option value="sandbox">Sandbox Test Mode</option>
                <option value="production">Production Live Mode</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground uppercase text-[10px]">Gateway Merchant ID</label>
              <Input type="text" defaultValue="merch_19A019X88b" />
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground uppercase text-[10px]">Secret API Key</label>
              <Input type="password" defaultValue="sk_test_51Kxyz..." />
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground uppercase text-[10px]">Reconciliation Webhook URL</label>
              <Input type="text" defaultValue="https://app.whatslandlord.com/api/v1/payments/webhook" />
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 flex justify-end">
            <Button onClick={handleSaveCredentials} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 text-xs h-9">
              <Save className="w-3.5 h-3.5" /> Save Credentials
            </Button>
          </div>
        </div>

        {/* Invoice Delivery Preferences */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Mail className="w-4 h-4 text-primary" /> Invoice Delivery Options
          </h3>

          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Configure automated distribution rules. When enabled, monthly invoices will be automatically generated and sent to the respective residents.
          </p>

          <div className="space-y-4 text-xs font-semibold">
            <label className="flex items-center space-x-3 p-3 bg-secondary/15 rounded-xl border border-border/40 hover:bg-secondary/25 transition cursor-pointer">
              <input
                type="checkbox"
                checked={emailPref}
                onChange={(e) => setEmailPref(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background"
              />
              <div>
                <p className="font-extrabold text-foreground">Auto-Send Invoices via Email</p>
                <p className="text-[10px] text-muted-foreground font-medium">Deliver monthly statements directly to tenant's registered email inbox.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-secondary/15 rounded-xl border border-border/40 hover:bg-secondary/25 transition cursor-pointer">
              <input
                type="checkbox"
                checked={smsPref}
                onChange={(e) => setSmsPref(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background"
              />
              <div>
                <p className="font-extrabold text-foreground">Auto-Send Invoices via SMS/Text</p>
                <p className="text-[10px] text-muted-foreground font-medium">Deliver instant text alerts to tenant's mobile phone number.</p>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-border/40 flex justify-end">
            <Button onClick={handleSaveDeliveryPrefs} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 text-xs h-9">
              <Save className="w-3.5 h-3.5" /> Save Delivery Preferences
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default PaymentSettingsPage;
