import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { CreditCard, Landmark, CheckCircle, Loader2, Shield, Check, Printer } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';import { clsx } from 'clsx';

export const TenantPaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'receipt'>('details');
  const [processingMsg, setProcessingMsg] = useState('Initializing SSL handshaking...');

  // Form states
  const [amount, setAmount] = useState('1250');
  const [method, setMethod] = useState<'ACH' | 'Credit Card' | 'Debit Card'>('ACH');

  // ACH Fields
  const [achHolderName, setAchHolderName] = useState('');
  const [achBankName, setAchBankName] = useState('');
  const [achRoutingNumber, setAchRoutingNumber] = useState('');
  const [achAccountNumber, setAchAccountNumber] = useState('');
  const [achAccountType, setAchAccountType] = useState('Checking');

  // Card Fields
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardZip, setCardZip] = useState('');

  const amountNum = Number(amount) || 0;
  const fee = method === 'ACH' 
    ? 0 
    : method === 'Credit Card' 
      ? Number((amountNum * 0.029).toFixed(2)) 
      : 4.99;
  const total = amountNum + fee;

  // Queries
  const { data: payments = [], isLoading } = useQuery({ queryKey: ['tenant-payments-list'], queryFn: () => api.tenantPayments.getAll() });

  const payMutation = useMutation({
    mutationFn: () => {
      return api.tenantPayments.payRent({
        amount: total,
        method,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-payments-list'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-dashboard-metrics'] });
      setStep('receipt');
    },
    onError: () => {
      setStep('details');
      alert('Transaction authorization failed. Please try again.');
    }
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setProcessingMsg('Initializing SSL handshaking...');
    
    setTimeout(() => {
      setProcessingMsg('Verifying security credentials...');
      setTimeout(() => {
        setProcessingMsg('Authorizing transaction with secure gateway...');
        setTimeout(() => {
          payMutation.mutate();
        }, 1200);
      }, 1000);
    }, 800);
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'date', header: 'Payment Date', id: 'date' },
    { accessorKey: 'method', header: 'Payment Method', id: 'method' },
    {
      accessorKey: 'amount',
      header: 'Amount Paid',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Clearing Status',
      id: 'status',
      cell: ({ row }) => <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">Cleared</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Rent Payments & Autopay"
        description="Verify monthly rent balances, enable ACH direct deposits, and download historical payment receipts."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Payments' },
        ]}
        action={{
          label: 'Submit Rent Payment',
          onClick: () => setIsOpen(true),
          icon: <CreditCard className="w-4.5 h-4.5" />,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Outstanding Rent balance */}
        <Card className="md:col-span-2 p-5 border bg-card flex justify-between items-center text-xs font-semibold">
          <div>
            <h4 className="font-extrabold uppercase text-muted-foreground text-[10px]">Outstanding balance due</h4>
            <p className="text-3xl font-black mt-2 text-emerald-500 flex items-center gap-1.5">
              $0.00
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Next rent period invoices generate on August 1st.</p>
          </div>
          <Button disabled variant="outline" className="border-slate-200 dark:border-white/10 text-muted-foreground bg-transparent">
            No Balance Due
          </Button>
        </Card>

        {/* Autopay status card */}
        <Card className="md:col-span-1 p-5 border bg-card space-y-3 text-xs font-semibold">
          <div className="flex items-center space-x-2 border-b pb-2">
            <Landmark className="w-5 h-5 text-emerald-500 shrink-0" />
            <h4 className="font-extrabold uppercase">Autopay Setup</h4>
          </div>
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <span className="text-emerald-500 font-extrabold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Enabled</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Automatically pulls from Chase checking account ending in XXXX-9822 on the 1st of each month.</p>
        </Card>

      </div>

      <div className="mb-3 text-xs font-bold text-muted-foreground uppercase">Payment history ledger</div>
      <DataTable columns={columns} data={payments} loading={isLoading} />

      {/* RENT PAYMENT DIALOG */}
      <FormDialog open={isOpen} onOpenChange={(val) => {
        setIsOpen(val);
        if (!val) {
          setStep('details');
        }
      }} title={step === 'receipt' ? "Payment Receipt" : "Submit Rent Payment"}>
        {step === 'details' && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2 text-xs font-semibold text-foreground">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Rent Amount</label>
              <Input type="number" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase block">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'ACH', label: 'ACH Bank', desc: '$0.00 fee', icon: <Landmark className="w-5 h-5" /> },
                  { id: 'Credit Card', label: 'Credit Card', desc: '2.9% fee', icon: <CreditCard className="w-5 h-5" /> },
                  { id: 'Debit Card', label: 'Debit Card', desc: '$4.99 fee', icon: <CreditCard className="w-5 h-5 text-indigo-500" /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMethod(t.id as any)}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center gap-1 transition ${
                      method === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {t.icon}
                    <span className="font-extrabold text-[10px] uppercase leading-none">{t.label}</span>
                    <span className="text-[9px] text-muted-foreground font-semibold">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs based on Payment Method */}
            {method === 'ACH' ? (
              <div className="space-y-3 p-3 bg-secondary/15 rounded-xl border border-border">
                <p className="text-[10px] font-extrabold uppercase text-primary">ACH Bank Information</p>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Holder Name</label>
                  <Input required placeholder="E.g., Jane Doe" value={achHolderName} onChange={e => setAchHolderName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Bank</label>
                    <Select required value={achBankName} onChange={e => setAchBankName(e.target.value)}>
                      <option value="">Select your bank</option>
                      <option value="Chase">Chase</option>
                      <option value="Bank of America">Bank of America</option>
                      <option value="Wells Fargo">Wells Fargo</option>
                      <option value="Citibank">Citibank</option>
                      <option value="Capital One">Capital One</option>
                      <option value="US Bank">U.S. Bank</option>
                      <option value="PNC Bank">PNC Bank</option>
                      <option value="TD Bank">TD Bank</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Type</label>
                    <Select value={achAccountType} onChange={e => setAchAccountType(e.target.value)}>
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Routing Number</label>
                    <Input required placeholder="9-digit routing" maxLength={9} value={achRoutingNumber} onChange={e => setAchRoutingNumber(e.target.value.replace(/\D/g, ''))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Number</label>
                    <Input required placeholder="Account number" value={achAccountNumber} onChange={e => setAchAccountNumber(e.target.value.replace(/\D/g, ''))} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-3 bg-secondary/15 rounded-xl border border-border">
                <p className="text-[10px] font-extrabold uppercase text-primary">Card details</p>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Cardholder Name</label>
                  <Input required placeholder="E.g., Jane Doe" value={cardholderName} onChange={e => setCardholderName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Card Number</label>
                  <div className="relative">
                    <Input required placeholder="4111 2222 3333 4444" maxLength={19} value={cardNumber} onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted.substring(0, 19));
                    }} />
                    <CreditCard className="absolute right-3 top-2.5 w-4.5 h-4.5 text-muted-foreground opacity-60 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Expiry (MM/YY)</label>
                    <Input required placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) {
                        val = val.substring(0,2) + '/' + val.substring(2,4);
                      }
                      setCardExpiry(val);
                    }} />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">CVV</label>
                    <Input required placeholder="123" type="password" maxLength={4} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Billing ZIP</label>
                    <Input required placeholder="12345" maxLength={5} value={cardZip} onChange={e => setCardZip(e.target.value.replace(/\D/g, ''))} />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Fee & Total Summary */}
            <div className="p-3 bg-secondary/10 border border-border rounded-xl space-y-1 text-xs font-semibold">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Rent Amount</span>
                <span>${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Convenience Fee ({method})</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground font-bold border-t pt-1 mt-1">
                <span>Total Charge</span>
                <span className="text-emerald-500 font-extrabold">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit SSL Secured Transaction</span>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">
                Pay Rent
              </Button>
            </div>

          </form>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-bold text-sm text-foreground">Processing Rent Payment...</p>
            <p className="text-[10px] text-muted-foreground">{processingMsg}</p>
            <div className="flex items-center gap-1 text-[9px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider mt-2">
              <Shield className="w-3.5 h-3.5" />
              <span>SSL Secured Gateway</span>
            </div>
          </div>
        )}

        {step === 'receipt' && (
          <div className="space-y-4 pt-2 text-xs font-semibold text-foreground animate-fade-in">
            <div className="text-center space-y-2 py-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="font-extrabold text-base text-emerald-500">Rent Payment Successful!</h3>
              <p className="text-[10px] text-muted-foreground">Your rent invoice has been marked as settled.</p>
            </div>

            <div className="p-4 bg-secondary/15 rounded-xl border border-border space-y-3 font-semibold text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Receipt Number</span>
                <span className="font-mono text-foreground font-bold">RCP-{Math.floor(100000 + Math.random() * 900000)}-ZTR</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{method}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Date / Time</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Base Rent</span>
                <span>${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Convenience Fee</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-foreground font-bold">Total Charged</span>
                <span className="text-emerald-500 font-extrabold text-sm">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => alert("Receipt sent to your printer queue.")} className="flex items-center gap-1.5 text-xs font-semibold">
                <Printer className="w-4.5 h-4.5" /> Print Receipt
              </Button>
              <Button onClick={() => {
                setIsOpen(false);
                setStep('details');
              }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};

// Reusable card container fallback helper
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('bg-card border rounded-2xl p-5', className)}>
    {children}
  </div>
);
export default TenantPaymentsPage;
