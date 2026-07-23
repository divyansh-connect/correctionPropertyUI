import React from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Sparkles, Save } from 'lucide-react';

export const PaymentSettingsPage: React.FC = () => {
  const handleSave = () => {
    alert('Payment Gateway credentials updated successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Settings"
        description="Integrate merchant accounts, configure webhook listeners, and select sandbox or production run environments."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Payment Settings' }]}
      />

      <div className="bg-card border border-border p-6 rounded-2xl max-w-2xl space-y-6 shadow-sm">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border pb-2">
          <Sparkles className="w-4 h-4 text-primary" /> Merchant Gateway Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Environment Mode</label>
            <Select defaultValue="sandbox">
              <option value="sandbox">Sandbox Test Mode</option>
              <option value="production">Production Live Mode</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Gateway Merchant ID</label>
            <Input type="text" defaultValue="merch_19A019X88b" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Secret API Key</label>
            <Input type="password" defaultValue="sk_test_51Kxyz..." />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground font-semibold">Reconciliation Webhook URL</label>
            <Input type="text" defaultValue="https://app.doorloop.com/api/v1/payments/webhook" />
          </div>
        </div>

        <div className="pt-4 border-t border-border/80 flex justify-end">
          <Button onClick={handleSave} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Gateway Credentials
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PaymentSettingsPage;
