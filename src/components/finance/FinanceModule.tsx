import React from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck
} from 'lucide-react';
import { FinanceInvoiceRecord, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FinanceModuleProps {
  records: FinanceInvoiceRecord[];
  onNavigate: (stage: ProcurementStage) => void;
  currency: 'INR' | 'USD';
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  records,
  currency,
}) => {
  const totalInvoiced = records.reduce((acc, r) => acc + r.amountPayable, 0);
  const totalPaid = records.reduce((acc, r) => acc + r.paidAmount, 0);
  const totalPending = records.reduce((acc, r) => acc + r.pendingAmount, 0);
  const totalSavings = records.reduce((acc, r) => acc + r.capturedSavingsAmount, 0);

  return (
    <div id="finance-module-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              FINANCE & 3-WAY INVOICE RECONCILIATION
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Treasury & AP Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Autonomous 3-Way Match & Payment Reconciliation
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Autonomous verification across Purchase Orders, Goods Receipt Notes (GRN), and Vendor Tax Invoices. Flags price creep, unauthorized charges, and schedules approved disbursement.
          </p>
        </div>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Total Invoiced</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)] truncate">
            {formatCurrency(totalInvoiced, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--foreground-muted)]">2 Invoices Logged</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Disbursed (Paid)</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--success)] truncate">
            {formatCurrency(totalPaid, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--success)]">Cleared via RTGS</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Scheduled / Pending</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--primary)] truncate">
            {formatCurrency(totalPending, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--foreground-muted)]">Net 45 (Vendor C)</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Captured Savings Realized</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--success)] truncate">
            {formatCurrency(totalSavings, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--success)] flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Realized vs Budget
          </div>
        </div>
      </div>

      {/* 3-Way Match Verification Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Autonomous 3-Way Verification Status
            </h2>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30 self-start sm:self-auto">
            100% MATCH • ZERO DISCREPANCY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
            <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" /> 1. Electronic PO Match
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Unit rate of ₹49,000 matches electronic PO-2026-089-VENDRAX line items with zero variance.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
            <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" /> 2. GRN Inbound Scan
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Warehouse barcode scan verifies 100 units passed physical QC with 0 rejected assets.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
            <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" /> 3. GST Tax Invoice
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Official e-invoice INV-2026-CC-8821 reconciles with ₹0.00 tax discrepancy.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Records Section */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Accounts Payable Invoice Ledger
            </h2>
          </div>
          <span className="text-[10px] text-[var(--foreground-muted)]">Audited Records</span>
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)] font-semibold text-[11px]">
                <th className="pb-3 pl-3">Invoice & PO #</th>
                <th className="pb-3">Vendor</th>
                <th className="pb-3 text-right">PO Value</th>
                <th className="pb-3 text-right">Amount Payable</th>
                <th className="pb-3 text-right">Paid</th>
                <th className="pb-3 text-right">Pending</th>
                <th className="pb-3 text-center">Due Date</th>
                <th className="pb-3 text-center pr-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-[var(--background)]/60 transition-colors">
                  <td className="py-3.5 pl-3">
                    <div className="font-bold text-[var(--foreground)]">{rec.invoiceNumber}</div>
                    <div className="text-[10px] text-[var(--primary)] font-medium">{rec.poNumber}</div>
                  </td>

                  <td className="py-3.5 font-semibold text-[var(--foreground)]">
                    {rec.vendorName}
                  </td>

                  <td className="py-3.5 text-right text-[var(--foreground-muted)]">
                    {formatCurrency(rec.poValue, currency, false)}
                  </td>

                  <td className="py-3.5 text-right font-bold text-[var(--foreground)]">
                    {formatCurrency(rec.amountPayable, currency, false)}
                  </td>

                  <td className="py-3.5 text-right text-[var(--success)] font-semibold">
                    {formatCurrency(rec.paidAmount, currency, false)}
                  </td>

                  <td className="py-3.5 text-right text-[var(--primary)] font-semibold">
                    {formatCurrency(rec.pendingAmount, currency, false)}
                  </td>

                  <td className="py-3.5 text-center text-[var(--foreground-muted)] text-[11px]">
                    {rec.dueDate}
                  </td>

                  <td className="py-3.5 text-center pr-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase ${
                      rec.status === 'paid'
                        ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                        : 'bg-[var(--background)] text-[var(--primary)] border-[var(--primary)]/30'
                    }`}>
                      {rec.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-[var(--foreground)] block">{rec.invoiceNumber}</span>
                  <span className="text-[11px] text-[var(--primary)] font-medium block">{rec.poNumber}</span>
                  <span className="text-xs text-[var(--foreground)]">{rec.vendorName}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${
                  rec.status === 'paid'
                    ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                    : 'bg-[var(--surface)] text-[var(--primary)] border-[var(--primary)]/30'
                }`}>
                  {rec.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-xs">
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Amount Payable:</span>
                  <span className="font-bold text-[var(--foreground)]">{formatCurrency(rec.amountPayable, currency, false)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Paid Amount:</span>
                  <span className="font-bold text-[var(--success)]">{formatCurrency(rec.paidAmount, currency, false)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Pending:</span>
                  <span className="font-bold text-[var(--primary)]">{formatCurrency(rec.pendingAmount, currency, false)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Due Date:</span>
                  <span className="text-[var(--foreground-muted)]">{rec.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
