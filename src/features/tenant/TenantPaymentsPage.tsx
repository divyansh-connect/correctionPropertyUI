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

  // Queries
  const { data: metrics } = useQuery({
    queryKey: ['tenant-dashboard-metrics'],
    queryFn: () => api.tenantPortal.getMetrics(),
  });
  const { data: allPayments = [], isLoading } = useQuery({ queryKey: ['tenant-payments-list'], queryFn: () => api.rent.getAll() });

  const { data: profile } = useQuery({
    queryKey: ['tenant-profile'],
    queryFn: () => api.tenantProfile.get(),
  });

  const { data: allInvoices = [] } = useQuery({
    queryKey: ['invoices-list'],
    queryFn: () => api.invoices.getAll(),
  });

  const outstandingBalance = metrics?.outstandingBalance ?? 0;

  const tenantName = profile ? `${profile.firstName} ${profile.lastName}` : 'Sarah Connor';

  const tenantInvoices = React.useMemo(() => {
    return allInvoices.filter((inv) => inv.tenantName === tenantName);
  }, [allInvoices, tenantName]);

  const tenantPayments = React.useMemo(() => {
    return allPayments.filter((pay) => pay.tenantName === tenantName);
  }, [allPayments, tenantName]);

  const ledgerEntries = React.useMemo(() => {
    const entries: Array<{
      date: string;
      desc: string;
      ref: string;
      debit: number;
      credit: number;
      balance: number;
      type: 'Charge' | 'Payment';
      status?: string;
    }> = [];

    let runningBalance = 0;

    // 1. Add invoices (charges)
    tenantInvoices.forEach((inv) => {
      entries.push({
        date: inv.dueDate,
        desc: 'Rent Assessment Charge',
        ref: inv.id,
        debit: 0,
        credit: inv.amount,
        balance: 0,
        type: 'Charge',
        status: inv.status
      });
    });

    // 2. Add payments (credits)
    tenantPayments.forEach((pay) => {
      if (pay.status === 'Paid') {
        entries.push({
          date: pay.paidDate || pay.dueDate || new Date().toISOString().split('T')[0],
          desc: `ACH Payment - Received (${pay.paymentMethod || 'Bank'})`,
          ref: pay.id,
          debit: pay.amount,
          credit: 0,
          balance: 0,
          type: 'Payment',
          status: 'Cleared'
        });
      }
    });

    // Sort by date ascending to calculate running balance
    entries.sort((a, b) => a.date.localeCompare(b.date));

    // Calculate running balance
    return entries.map((entry) => {
      if (entry.type === 'Payment') {
        runningBalance += entry.debit;
      } else {
        runningBalance -= entry.credit;
      }
      return {
        ...entry,
        balance: runningBalance
      };
    });
  }, [tenantInvoices, tenantPayments]);

  // Form states
  const [paymentOption, setPaymentOption] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState('1850');
  const [method, setMethod] = useState<'ACH' | 'Credit Card' | 'Debit Card'>('ACH');
  const [receiptNumber, setReceiptNumber] = useState('');

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

  // Sync amount with option
  React.useEffect(() => {
    if (paymentOption === 'full') {
      setAmount(outstandingBalance.toString());
    }
  }, [outstandingBalance, paymentOption]);

  const amountNum = Number(amount) || 0;
  const fee = method === 'ACH' 
    ? 0 
    : method === 'Credit Card' 
      ? Number((amountNum * 0.029).toFixed(2)) 
      : 4.99;
  const total = amountNum + fee;

  const payMutation = useMutation({
    mutationFn: () => {
      return api.tenantPayments.payRent({
        amount: total,
        baseAmount: amountNum,
        method,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-payments-list'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-dashboard-metrics'] });
      setReceiptNumber(`RCP-${Math.floor(100000 + Math.random() * 900000)}-ZTR`);
      setStep('receipt');
    },
    onError: () => {
      setStep('details');
      alert('Transaction authorization failed. Please try again.');
    }
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt - ${receiptNumber}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1f2937;
              padding: 40px;
              max-width: 480px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .receipt-card {
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              padding: 30px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
            }
            .logo {
              font-size: 24px;
              font-weight: 900;
              letter-spacing: -0.05em;
              color: #2563eb;
              margin: 0;
            }
            .logo span {
              color: #10b981;
            }
            .header h1 {
              font-size: 16px;
              font-weight: 800;
              margin: 10px 0 0 0;
              color: #111827;
            }
            .header p {
              font-size: 11px;
              color: #6b7280;
              margin: 3px 0 0 0;
            }
            .success-stamp {
              background-color: #d1fae5;
              color: #065f46;
              border: 1px solid #a7f3d0;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              padding: 4px 14px;
              border-radius: 9999px;
              display: inline-block;
              margin-top: 12px;
              letter-spacing: 0.05em;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .details-table td {
              padding: 12px 0;
              border-bottom: 1px dashed #e5e7eb;
              font-size: 11px;
            }
            .details-table tr:last-child td {
              border-bottom: none;
            }
            .label {
              color: #6b7280;
              font-weight: 600;
            }
            .val {
              text-align: right;
              font-weight: 700;
              color: #111827;
            }
            .total-val {
              color: #10b981;
              font-size: 13px;
              font-weight: 900;
            }
            .footer {
              text-align: center;
              font-size: 9px;
              color: #9ca3af;
              margin-top: 25px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header">
              <h3 class="logo">Apex<span>Living</span></h3>
              <h1>Payment Receipt</h1>
              <p>Reference ID: ${receiptNumber}</p>
              <span class="success-stamp">Paid & Cleared</span>
            </div>
            <table class="details-table">
              <tr>
                <td class="label">Date / Time</td>
                <td class="val">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td class="label">Payment Method</td>
                <td class="val">${method}</td>
              </tr>
              <tr>
                <td class="label">Base Rent</td>
                <td class="val">$${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td class="label">Processing Fee</td>
                <td class="val">$${fee.toFixed(2)}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td class="label" style="font-size:12px; font-weight:800; color:#111827;">Total Charged</td>
                <td class="val total-val">$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </table>
            <div class="footer">
              Thank you for your rent payment!<br>Apex Property Management System
            </div>
          </div>
          <div style="text-align:center; margin-top:20px;" class="no-print">
            <button onclick="window.print()" style="padding:8px 16px; font-size:12px; font-weight:bold; cursor:pointer;">Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
    { accessorKey: 'date', header: 'Date', id: 'date' },
    { accessorKey: 'desc', header: 'Description', id: 'desc' },
    { accessorKey: 'ref', header: 'Reference ID', id: 'ref', cell: ({ row }) => <span className="font-mono text-[10px]">{row.original.ref}</span> },
    {
      accessorKey: 'debit',
      header: 'Debit (+)',
      id: 'debit',
      cell: ({ row }) => row.original.debit > 0 ? <span className="text-emerald-500 font-bold">+${row.original.debit.toLocaleString()}</span> : '-',
    },
    {
      accessorKey: 'credit',
      header: 'Credit (-)',
      id: 'credit',
      cell: ({ row }) => row.original.credit > 0 ? <span className="text-rose-500 font-bold">-${row.original.credit.toLocaleString()}</span> : '-',
    },
    {
      accessorKey: 'balance',
      header: 'Running Balance',
      id: 'balance',
      cell: ({ row }) => (
        <span className={row.original.balance >= 0 ? 'text-emerald-500 font-black' : 'text-rose-500 font-black'}>
          {row.original.balance < 0 ? '-' : ''}${Math.abs(row.original.balance).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => (
        <span className={clsx(
          "text-[10px] font-black px-2.5 py-0.5 rounded border",
          row.original.type === 'Charge' 
            ? row.original.status === 'Paid' 
              ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
              : "text-amber-500 bg-amber-500/10 border-amber-500/20"
            : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        )}>
          {row.original.type === 'Charge' ? (row.original.status === 'Paid' ? 'Paid' : 'Pending') : 'Cleared'}
        </span>
      ),
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
            <p className={`text-3xl font-black mt-2 flex items-center gap-1.5 ${outstandingBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              ${outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              {outstandingBalance === 0 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Next rent period invoices generate on August 1st.</p>
          </div>
          <Button 
            disabled={outstandingBalance === 0} 
            onClick={() => {
              setPaymentOption('full');
              setIsOpen(true);
            }}
            variant={outstandingBalance > 0 ? 'default' : 'outline'} 
            className={outstandingBalance > 0 ? '' : 'border-slate-200 dark:border-white/10 text-muted-foreground bg-transparent'}
          >
            {outstandingBalance > 0 ? 'Pay Rent' : 'No Balance Due'}
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

      <div className="mb-3 text-xs font-bold text-muted-foreground uppercase flex justify-between items-center">
        <span>Payment history ledger</span>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="text-[10px] font-bold flex items-center gap-1.5 h-8">
          <Printer className="w-3.5 h-3.5" /> Print Ledger
        </Button>
      </div>

      <div id="printable-tenant-ledger-area">
        <style>{`
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            body * {
              visibility: hidden !important;
            }
            #printable-tenant-ledger-area, #printable-tenant-ledger-area * {
              visibility: visible !important;
            }
            #printable-tenant-ledger-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              border: none !important;
              box-shadow: none !important;
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
            th, td {
              border-bottom: 1px solid #e2e8f0 !important;
              padding: 8px 4px !important;
              color: black !important;
            }
            th {
              font-weight: 800 !important;
            }
          }
        `}</style>
        <DataTable columns={columns} data={ledgerEntries} loading={isLoading} />
      </div>

      {/* RENT PAYMENT DIALOG */}
      <FormDialog open={isOpen} onOpenChange={(val) => {
        setIsOpen(val);
        if (!val) {
          setStep('details');
          setReceiptNumber('');
        }
      }} title={step === 'receipt' ? "Payment Receipt" : "Submit Rent Payment"}>
        {step === 'details' && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2 text-xs font-semibold text-foreground">
            
            {/* Payment Option Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase block">Payment Option</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  key="opt-full"
                  type="button"
                  onClick={() => setPaymentOption('full')}
                  className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center gap-1 transition ${
                    paymentOption === 'full' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-extrabold text-[10px] uppercase">Pay in Full</span>
                  <span className="text-[9px] text-muted-foreground font-semibold">
                    ${outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </button>
                <button
                  key="opt-partial"
                  type="button"
                  onClick={() => {
                    setPaymentOption('partial');
                    setAmount((outstandingBalance * 0.5).toFixed(0));
                  }}
                  className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center gap-1 transition ${
                    paymentOption === 'partial' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-extrabold text-[10px] uppercase">Partial Payment</span>
                  <span className="text-[9px] text-muted-foreground font-semibold">Pay custom amount</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Amount</label>
              <Input 
                type="number" 
                required 
                min="1" 
                max={outstandingBalance} 
                disabled={paymentOption === 'full'}
                value={amount} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (Number(val) > outstandingBalance) {
                    setAmount(outstandingBalance.toString());
                  } else {
                    setAmount(val);
                  }
                }} 
              />
              {paymentOption === 'partial' && (
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-semibold">
                  <span>Max: ${outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>Remaining balance: <span className="text-amber-500 font-bold">${Math.max(0, outstandingBalance - amountNum).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                </div>
              )}
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
              <Button type="submit" disabled={amountNum <= 0 || amountNum > outstandingBalance}>
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
                <span className="font-mono text-foreground font-bold">{receiptNumber}</span>
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
              <Button type="button" variant="outline" onClick={handlePrint} className="flex items-center gap-1.5 text-xs font-semibold">
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
