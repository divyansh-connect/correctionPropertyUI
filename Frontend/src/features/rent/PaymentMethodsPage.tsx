import React, { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormDialog } from '../../components/FormDialog';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CreditCard, Landmark, Plus, Trash2, ShieldCheck, Heart } from 'lucide-react';

interface StoredMethod {
  id: string;
  type: 'ACH' | 'Credit Card';
  title: string;
  details: string;
  isDefault: boolean;
}

export const PaymentMethodsPage: React.FC = () => {
  const [methods, setMethods] = useState<StoredMethod[]>([
    { id: '1', type: 'ACH', title: 'Chase Checking', details: 'Routing: ****0120 Account: ******6543', isDefault: true },
    { id: '2', type: 'Credit Card', title: 'Visa Premium Card', details: 'Ending in 4321 - Exp 12/28', isDefault: false },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [methodType, setMethodType] = useState<'ACH' | 'Credit Card'>('ACH');
  const [name, setName] = useState('');
  const [detailStr, setDetailStr] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setMethods((prev) => [
      ...prev,
      {
        id: `met-${Date.now()}`,
        type: methodType,
        title: name,
        details: detailStr || 'Routing: ****9876 Account: ******1234',
        isDefault: false,
      },
    ]);
    setIsOpen(false);
    setName('');
    setDetailStr('');
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Stored Payment Methods"
        description="Verify property business payout bank accounts or tenant autopay profiles."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Payment Methods' },
        ]}
        action={{
          label: 'Add Stored Method',
          onClick: () => setIsOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m) => (
          <Card key={m.id} className="p-5 border border-border bg-card flex justify-between items-start">
            <div className="flex space-x-3.5">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                {m.type === 'ACH' ? <Landmark className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  {m.title}
                  {m.isDefault && (
                    <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                      Default
                    </span>
                  )}
                </h4>
                <p className="text-xs text-muted-foreground font-semibold">{m.details}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-2 items-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(m.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </Button>
              {!m.isDefault && (
                <Button variant="ghost" size="sm" onClick={() => handleSetDefault(m.id)} className="text-[10px] h-7 font-bold">
                  Set Default
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* ADD METHOD DIALOG */}
      <FormDialog open={isOpen} onOpenChange={setIsOpen} title="Register Stored Account">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Account Type</label>
            <Select value={methodType} onChange={(e) => setMethodType(e.target.value as any)}>
              <option value="ACH">ACH Direct Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Card / Institution Name</label>
            <Input placeholder="Chase Checking / Visa Card" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Details</label>
            <Input placeholder="Routing: ****0120 Account: ******6543" value={detailStr} onChange={(e) => setDetailStr(e.target.value)} />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!name.trim()}>Save Account</Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
};
export default PaymentMethodsPage;
