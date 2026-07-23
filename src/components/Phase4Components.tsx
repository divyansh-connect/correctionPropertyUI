import React from 'react';
import { Card } from './ui/Card';
import { StatusBadge } from './StatusBadge';
import { DollarSign, Calendar, CreditCard, Clock, FileText, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

// --- PAYMENT CARD ---
interface PaymentCardProps {
  receiptNumber: string;
  tenantName: string;
  amount: number;
  date: string;
  status: string;
  method: string;
  onClick?: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  receiptNumber,
  tenantName,
  amount,
  date,
  status,
  method,
  onClick,
}) => {
  return (
    <Card onClick={onClick} className="p-5 hover:shadow-md transition-all cursor-pointer bg-card border-border flex flex-col justify-between h-full text-foreground">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
            Receipt {receiptNumber}
          </span>
          <h4 className="font-bold text-sm text-foreground mt-1.5 truncate max-w-[150px]">{tenantName}</h4>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="my-4 pt-3 border-t text-xs font-semibold">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="text-emerald-500 font-extrabold">${amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-muted-foreground">Channel</span>
          <span>{method}</span>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5" />
        {date}
      </div>
    </Card>
  );
};

// --- INVOICE CARD ---
interface InvoiceCardProps {
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  balance: number;
  dueDate: string;
  status: string;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoiceNumber,
  tenantName,
  amount,
  balance,
  dueDate,
  status,
}) => {
  return (
    <Card className="p-5 bg-card border-border text-foreground space-y-4">
      <div className="flex justify-between items-start border-b pb-2">
        <div>
          <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
            Invoice {invoiceNumber}
          </span>
          <h4 className="font-bold text-sm mt-1">{tenantName}</h4>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <div>
          <p className="text-muted-foreground text-[10px] uppercase">Amount Due</p>
          <p className="font-extrabold text-foreground text-sm mt-0.5">${amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] uppercase">Balance</p>
          <p className={clsx('font-extrabold text-sm mt-0.5', balance > 0 ? 'text-rose-500' : 'text-emerald-500')}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 pt-2 border-t border-dashed">
        <Calendar className="w-3.5 h-3.5" /> Due Date: {dueDate}
      </div>
    </Card>
  );
};

// --- CHARGE CARD ---
interface ChargeCardProps {
  name: string;
  tenantName: string;
  amount: number;
  frequency: string;
  status: string;
}

export const ChargeCard: React.FC<ChargeCardProps> = ({
  name,
  tenantName,
  amount,
  frequency,
  status,
}) => {
  return (
    <Card className="p-5 bg-card border-border text-foreground flex justify-between items-center">
      <div className="space-y-1.5 overflow-hidden">
        <span className="text-[9px] font-bold bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded uppercase">
          {frequency}
        </span>
        <h4 className="font-bold text-sm truncate pr-2">{name}</h4>
        <p className="text-[10px] text-muted-foreground font-semibold">{tenantName}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-base font-extrabold text-foreground">${amount.toLocaleString()}</p>
        <span className="inline-block mt-1"><StatusBadge status={status} /></span>
      </div>
    </Card>
  );
};

// --- PAYMENT METHOD BADGE ---
export const PaymentMethodBadge: React.FC<{ method: string }> = ({ method }) => {
  return (
    <span className="inline-flex items-center gap-1 bg-secondary/60 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-lg border border-border">
      <CreditCard className="w-3 h-3 text-primary" />
      {method}
    </span>
  );
};

// --- DUE DATE BADGE ---
export const DueDateBadge: React.FC<{ date: string; overdue?: boolean }> = ({ date, overdue }) => {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border',
      overdue 
        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
        : 'bg-secondary/60 text-foreground border-border'
    )}>
      <Clock className="w-3 h-3" />
      {date}
    </span>
  );
};

// --- RECEIPT PREVIEW ---
interface ReceiptPreviewProps {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  date: string;
  method: string;
  refNumber?: string;
  createdBy: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  id,
  tenantName,
  propertyName,
  unitNumber,
  amount,
  date,
  method,
  refNumber,
  createdBy,
}) => {
  return (
    <div className="border border-border/80 rounded-2xl p-6 bg-card text-foreground max-w-md mx-auto space-y-6 shadow-sm">
      <div className="text-center border-b pb-4 space-y-1">
        <h4 className="font-extrabold text-lg tracking-tight">PAYMENT RECEIPT</h4>
        <p className="text-[10px] text-muted-foreground font-bold uppercase">Transaction ID: {id}</p>
      </div>

      <div className="space-y-4 text-xs font-semibold">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Received From</span>
          <span>{tenantName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Property Unit</span>
          <span>{propertyName} • Unit {unitNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Date</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Method Channel</span>
          <span>{method}</span>
        </div>
        {refNumber && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reference No.</span>
            <span>{refNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Issued By</span>
          <span>{createdBy}</span>
        </div>
      </div>

      <div className="border-t border-dashed pt-4 flex justify-between items-center">
        <span className="text-sm font-black uppercase text-muted-foreground">Total Paid</span>
        <span className="text-2xl font-black text-emerald-500">${amount.toLocaleString()}</span>
      </div>

      <div className="flex justify-center text-muted-foreground/60 text-[9px] font-bold border-t pt-3 flex-col items-center gap-1">
        <CheckCircle className="w-5 h-5 text-emerald-500" />
        <span>Thank you for your payment. Safe transaction confirmed.</span>
      </div>
    </div>
  );
};

// --- CURRENCY INPUT ---
interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="space-y-1 w-full text-foreground">
      {label && <label className="text-xs font-bold text-muted-foreground uppercase">{label}</label>}
      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-muted-foreground text-sm font-bold">$</span>
        </div>
        <input
          type="number"
          step="0.01"
          className="block w-full pl-7 pr-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          {...props}
        />
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
};

// --- AMOUNT SUMMARY ---
interface AmountSummaryProps {
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
}

export const AmountSummary: React.FC<AmountSummaryProps> = ({
  subtotal,
  discount = 0,
  tax = 0,
  total,
}) => {
  return (
    <div className="bg-secondary/20 border rounded-xl p-4 text-xs font-semibold text-foreground space-y-2 max-w-xs ml-auto">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${subtotal.toLocaleString()}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-rose-500">
          <span>Discount</span>
          <span>-${discount.toLocaleString()}</span>
        </div>
      )}
      {tax > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes</span>
          <span>${tax.toLocaleString()}</span>
        </div>
      )}
      <div className="border-t pt-2 flex justify-between font-black text-sm text-foreground">
        <span>Total Amount</span>
        <span>${total.toLocaleString()}</span>
      </div>
    </div>
  );
};
