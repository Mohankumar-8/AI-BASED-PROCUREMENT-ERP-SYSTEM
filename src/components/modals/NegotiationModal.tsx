import React, { useState } from 'react';
import { 
  Send, 
  Check, 
  Copy, 
  Sparkle,
  X
} from 'lucide-react';
import { VendorQuote } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorQuote: VendorQuote;
  currency: 'INR' | 'USD';
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  isOpen,
  onClose,
  vendorQuote,
  currency,
}) => {
  const [discountTargetPct] = useState(3.5);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetAmount = Math.round(vendorQuote.quotedTotal * (1 - discountTargetPct / 100));
  const savingsAmount = vendorQuote.quotedTotal - targetAmount;

  const generatedLetter = `Subject: Commercial Terms & Volume Price Counter-Proposal - ${vendorQuote.quoteReference}

Dear ${vendorQuote.vendorName} Commercial Team,

Thank you for submitting quotation ${vendorQuote.quoteReference} for the 100x Enterprise Laptops RFQ. 

VendraX Procurement has evaluated your technical proposal and ranked your offering highly based on your 5-day delivery turnaround and 3-year on-site SLA.

To finalize immediate award of Purchase Order PO-2026-089-VENDRAX, we request the following structured adjustment:
1. Target Landed Price: ${formatCurrency(targetAmount, currency, false)} (A ${discountTargetPct}% volume rebate from ${formatCurrency(vendorQuote.quotedTotal, currency, false)}).
2. Retain full 3-year 24x7 on-site SLA with free initial imaging.
3. Payment terms fixed at Net 45 days.

Upon receipt of your revised confirmation within 24 hours, our autonomous procurement engine will execute zero-touch electronic PO issuance.

Sincerely,
Procurement Operations Team
VendraX Enterprise`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-xl text-[var(--foreground)] my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase">AI Counter-Offer & Negotiation Drafter</h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center justify-center text-sm transition-colors cursor-pointer touch-target"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
          <div>
            <span className="text-[var(--foreground-muted)] block text-[10px]">Current Quote Total</span>
            <span className="font-bold text-[var(--foreground)] text-sm">
              {formatCurrency(vendorQuote.quotedTotal, currency, false)}
            </span>
          </div>
          <div>
            <span className="text-[var(--foreground-muted)] block text-[10px]">Target Landed Cost ({discountTargetPct}% off)</span>
            <span className="font-bold text-[var(--success)] text-sm">
              {formatCurrency(targetAmount, currency, false)}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)] ml-1">
              (Save {formatCurrency(savingsAmount, currency, false)})
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[var(--foreground)] block">
            Generated Enterprise Counter-Offer Letter:
          </label>
          <textarea
            value={generatedLetter}
            readOnly
            rows={7}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] focus:outline-none leading-relaxed resize-none font-mono text-[11px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[var(--border)] cursor-pointer touch-target"
          >
            {copied ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4 text-[var(--foreground-muted)]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Counter-Offer'}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground-muted)] text-xs font-semibold border border-[var(--border)] cursor-pointer touch-target text-center"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-target"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Vendor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
