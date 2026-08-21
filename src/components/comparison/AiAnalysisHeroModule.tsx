import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Scale, 
  FileCheck, 
  Zap, 
  Sparkle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { RFQ, VendorQuote, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { initialDecisionBrief } from '../../data/mockData';
import { WhyVendorModal } from '../modals/WhyVendorModal';
import { NegotiationModal } from '../modals/NegotiationModal';

interface AiAnalysisHeroModuleProps {
  activeRfq: RFQ;
  quotes: VendorQuote[];
  onApproveAndGeneratePo: (rfq: RFQ, winnerQuote: VendorQuote) => void;
  onNavigate: (stage: ProcurementStage) => void;
  currency: 'INR' | 'USD';
}

export const AiAnalysisHeroModule: React.FC<AiAnalysisHeroModuleProps> = ({
  activeRfq,
  quotes,
  onApproveAndGeneratePo,
  onNavigate,
  currency,
}) => {
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);

  // Identify recommended winner (Vendor C by default)
  const winnerQuote = quotes.find((q) => q.isRecommendedWinner) || quotes[0] || null;
  const brief = initialDecisionBrief;

  if (!quotes || quotes.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-4 shadow-xs">
        <Scale className="w-10 h-10 text-[var(--foreground-muted)] mx-auto" />
        <h2 className="text-base font-bold text-[var(--foreground)]">No Quotations Found for AI Analysis</h2>
        <p className="text-xs text-[var(--foreground-muted)] max-w-md mx-auto">
          Please upload or ingest vendor quotation proposals in the Quotations module to run true landed cost modeling and multi-factor ranking.
        </p>
        <button
          onClick={() => onNavigate('quotations')}
          className="px-5 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-semibold text-xs transition-colors cursor-pointer touch-target"
        >
          Go to Quotations Ingestion
        </button>
      </div>
    );
  }

  return (
    <div id="ai-analysis-hero-module" className="space-y-6 pb-16">
      {/* 1. Context Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] border border-[var(--secondary)]/30 flex items-center justify-center text-[var(--primary)] shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[var(--foreground)] flex items-center gap-2 flex-wrap">
              <span className="truncate">{activeRfq.rfqNumber}: {activeRfq.title}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30 shrink-0">
                DECISION READY
              </span>
            </div>
            <div className="text-[11px] text-[var(--foreground-muted)]">
              Target Budget: <strong className="text-[var(--primary)] font-semibold">{formatCurrency(activeRfq.targetBudget, currency, false)}</strong> | 3 Commercial Bids Evaluated
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <span className="text-[11px] text-[var(--foreground-muted)]">
            AI Confidence: <strong className="text-[var(--primary)] font-semibold">98.4%</strong>
          </span>
          <button
            onClick={() => onNavigate('quotations')}
            className="px-3 py-1.5 rounded-lg bg-[var(--background)] hover:bg-[var(--border)]/50 text-[var(--foreground)] text-[11px] font-semibold border border-[var(--border)] transition-colors cursor-pointer touch-target"
          >
            + Ingest More Bids
          </button>
        </div>
      </div>

      {/* 2. THE HERO AI RECOMMENDATION CARD */}
      {winnerQuote && (
        <div className="p-5 sm:p-7 rounded-xl bg-[var(--surface)] border-l-4 border-l-[var(--primary)] border-t border-r border-b border-[var(--border)] shadow-xs space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--surface)] shrink-0 shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30 uppercase tracking-wide flex items-center gap-1">
                    <Sparkle className="w-3 h-3 text-[var(--accent)]" /> AI RECOMMENDATION
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">Executive Decision Synthesis</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight mt-0.5">
                  {winnerQuote.vendorName}
                </h2>
              </div>
            </div>

            {/* AI Score Badge */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="sm:text-right">
                <div className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Overall AI Score</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] tracking-tight">
                  {winnerQuote.vendorScore.overallScore}
                  <span className="text-sm text-[var(--foreground-muted)] font-normal"> / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Recommendation Statement & Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Synthesis Statement & Attributes */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-xs sm:text-[13px] leading-relaxed">
                <div className="text-[11px] font-semibold text-[var(--primary)] mb-1">RECOMMENDATION JUSTIFICATION</div>
                "{brief.executiveSummary}"
              </div>

              {/* 5 Evaluated Decision Vectors */}
              <div className="p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-[11px] font-semibold text-[var(--foreground)]">Recommended because it provides the optimal combination of:</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                    <span>True Cost</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                    <span>Delivery (5d)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                    <span>Reliability (96%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                    <span>3-Yr Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                    <span>Low Risk</span>
                  </div>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs pt-1">
                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--foreground-muted)] font-medium uppercase">True Landed Cost</div>
                  <div className="text-base font-bold text-[var(--foreground)] mt-0.5 truncate">
                    {formatCurrency(winnerQuote.trueCost.totalTrueCost, currency, false)}
                  </div>
                  <div className="text-[10px] text-[var(--success)] font-semibold flex items-center gap-0.5 truncate">
                    <TrendingDown className="w-3 h-3 shrink-0" /> ₹1.0L Under Budget
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--foreground-muted)] font-medium uppercase">Delivery SLA</div>
                  <div className="text-base font-bold text-[var(--foreground)] mt-0.5 truncate">
                    {winnerQuote.deliveryLeadTimeDays} Days
                  </div>
                  <div className="text-[10px] text-[var(--success)] font-medium">Fastest Lead Time</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--foreground-muted)] font-medium uppercase">Warranty SLA</div>
                  <div className="text-base font-bold text-[var(--foreground)] mt-0.5 truncate">
                    {winnerQuote.warrantyPeriodMonths} Months
                  </div>
                  <div className="text-[10px] text-[var(--primary)] font-medium">3-Yr On-Site SLA</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--foreground-muted)] font-medium uppercase">Reliability Score</div>
                  <div className="text-base font-bold text-[var(--success)] mt-0.5 truncate">
                    {winnerQuote.historicalReliabilityPct}%
                  </div>
                  <div className="text-[10px] text-[var(--success)] font-medium">0.2% Defect Rate</div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Executive Actions */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-3 p-4 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--foreground-muted)]">Risk Assessment:</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--success)] border border-[var(--secondary)]/30 font-semibold text-[11px]">
                    LOW RISK
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--foreground-muted)]">Captured Savings:</span>
                  <span className="font-bold text-[var(--success)]">
                    {formatCurrency(brief.expectedSavingsINR, currency, false)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--foreground-muted)]">Auto-Pass Status:</span>
                  <span className="text-[var(--primary)] font-semibold">100% Policy Match</span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                <button
                  id="btn-approve-generate-po"
                  onClick={() => onApproveAndGeneratePo(activeRfq, winnerQuote)}
                  className="w-full py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer touch-target"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Generate PO</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsWhyModalOpen(true)}
                    className="py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)]/40 text-[var(--foreground)] font-semibold text-xs border border-[var(--border)] flex items-center justify-center gap-1 transition-colors cursor-pointer touch-target"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                    <span>Why Vendor?</span>
                  </button>

                  <button
                    onClick={() => setIsNegotiateModalOpen(true)}
                    className="py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)]/40 text-[var(--foreground)] font-semibold text-xs border border-[var(--border)] flex items-center justify-center gap-1 transition-colors cursor-pointer touch-target"
                  >
                    <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Counter-Offer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-FACTOR VENDOR COMPARISON TABLE */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Comprehensive Vendor Quotation Comparison
            </h2>
          </div>
          <span className="text-[10px] text-[var(--foreground-muted)] font-medium">
            Normalized against 100 Units Laptop RFQ Specifications
          </span>
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)] font-semibold text-[11px]">
                <th className="pb-3 pl-3">Vendor</th>
                <th className="pb-3 text-right">Base Price</th>
                <th className="pb-3 text-right">True Cost</th>
                <th className="pb-3 text-center">Delivery</th>
                <th className="pb-3 text-center">Warranty</th>
                <th className="pb-3 text-center">Reliability</th>
                <th className="pb-3 text-center">Risk Level</th>
                <th className="pb-3 text-center pr-3">AI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {quotes.map((quote) => {
                const isWinner = quote.isRecommendedWinner;
                const isRisky = quote.riskLevel === 'HIGH';
                return (
                  <tr
                    key={quote.id}
                    className={`transition-colors ${
                      isWinner
                        ? 'bg-[var(--primary-light)]/40 border-l-4 border-l-[var(--primary)]'
                        : isRisky
                        ? 'bg-[var(--danger-light)]/40 border-l-4 border-l-[var(--danger)]'
                        : 'hover:bg-[var(--background)]'
                    }`}
                  >
                    {/* Vendor Name */}
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--foreground)] text-sm">{quote.vendorName}</span>
                        {isWinner && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--surface)]">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                        {quote.incoterms} • {quote.paymentTerms}
                      </div>
                    </td>

                    {/* Base Price */}
                    <td className="py-3.5 text-right text-[var(--foreground-muted)] font-medium">
                      {formatCurrency(quote.basePrice, currency, false)}
                    </td>

                    {/* True Cost */}
                    <td className="py-3.5 text-right">
                      <div className={`font-bold text-sm ${isWinner ? 'text-[var(--primary)]' : isRisky ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}`}>
                        {formatCurrency(quote.trueCost.totalTrueCost, currency, false)}
                      </div>
                      {quote.trueCost.totalTrueCost > quote.basePrice && (
                        <div className="text-[10px] text-[var(--danger)] font-medium">
                          +{formatCurrency(quote.trueCost.totalTrueCost - quote.basePrice, currency, true)} hidden
                        </div>
                      )}
                    </td>

                    {/* Delivery */}
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        quote.deliveryLeadTimeDays <= 5
                          ? 'text-[var(--success)] bg-[var(--primary-light)]'
                          : quote.deliveryLeadTimeDays <= 10
                          ? 'text-[var(--foreground)]'
                          : 'text-[var(--danger)] bg-[var(--danger-light)] font-semibold'
                      }`}>
                        {quote.deliveryLeadTimeDays} Days
                      </span>
                    </td>

                    {/* Warranty */}
                    <td className="py-3.5 text-center text-[var(--foreground)] font-medium">
                      {quote.warrantyPeriodMonths / 12} Years
                    </td>

                    {/* Reliability */}
                    <td className="py-3.5 text-center font-semibold">
                      <span className={quote.historicalReliabilityPct >= 95 ? 'text-[var(--success)]' : quote.historicalReliabilityPct >= 90 ? 'text-[var(--primary)]' : 'text-[var(--danger)]'}>
                        {quote.historicalReliabilityPct}%
                      </span>
                    </td>

                    {/* Risk */}
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        quote.riskLevel === 'LOW'
                          ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                          : 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30'
                      }`}>
                        {quote.riskLevel === 'LOW' ? 'Low Risk' : 'High Risk'}
                      </span>
                    </td>

                    {/* AI Score */}
                    <td className="py-3.5 text-center pr-3">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] font-bold text-sm">
                        <span className={isWinner ? 'text-[var(--primary)] text-base' : 'text-[var(--foreground)]'}>
                          {quote.vendorScore.overallScore}
                        </span>
                        <span className="text-[10px] text-[var(--foreground-muted)] font-normal">/100</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Comparison Cards */}
        <div className="sm:hidden space-y-3">
          {quotes.map((quote) => {
            const isWinner = quote.isRecommendedWinner;
            const isRisky = quote.riskLevel === 'HIGH';
            return (
              <div
                key={quote.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  isWinner
                    ? 'bg-[var(--primary-light)]/30 border-[var(--primary)]'
                    : isRisky
                    ? 'bg-[var(--danger-light)]/30 border-[var(--danger)]/50'
                    : 'bg-[var(--background)] border-[var(--border)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[var(--foreground)] block">{quote.vendorName}</span>
                    <span className="text-[10px] text-[var(--foreground-muted)]">{quote.incoterms} • {quote.paymentTerms}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--foreground-muted)] block">AI Score</span>
                    <span className={`text-base font-extrabold ${isWinner ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                      {quote.vendorScore.overallScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--foreground-muted)] block">Base Price:</span>
                    <span className="text-[var(--foreground)] font-medium">{formatCurrency(quote.basePrice, currency, false)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--foreground-muted)] block">True Landed Cost:</span>
                    <span className={`font-bold ${isWinner ? 'text-[var(--primary)]' : isRisky ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}`}>
                      {formatCurrency(quote.trueCost.totalTrueCost, currency, false)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--foreground-muted)] block">Lead Time:</span>
                    <span className="text-[var(--foreground)] font-medium">{quote.deliveryLeadTimeDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--foreground-muted)] block">Reliability / SLA:</span>
                    <span className="text-[var(--success)] font-medium">{quote.historicalReliabilityPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TRUE PROCUREMENT COST ARCHITECTURE */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              True Procurement Cost Architecture
            </h2>
          </div>
          <span className="text-[10px] text-[var(--primary)] font-semibold">
            Total Landed Cost Formula Engine
          </span>
        </div>

        {/* Formula Bar */}
        <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center text-xs text-[var(--foreground)] overflow-x-auto flex items-center justify-center gap-2 flex-wrap font-medium">
          <span className="font-bold">Base Price</span>
          <span className="text-[var(--foreground-muted)]">+</span>
          <span>Tax</span>
          <span className="text-[var(--foreground-muted)]">+</span>
          <span className="text-[var(--danger)] font-bold">Shipping / Freight</span>
          <span className="text-[var(--foreground-muted)]">+</span>
          <span>Installation</span>
          <span className="text-[var(--foreground-muted)]">+</span>
          <span className="text-[var(--accent)] font-bold">Maintenance Equalizer</span>
          <span className="text-[var(--foreground-muted)]">-</span>
          <span className="text-[var(--success)] font-bold">Discount</span>
          <span className="text-[var(--foreground-muted)]">=</span>
          <span className="text-[var(--surface)] font-bold bg-[var(--primary)] px-2.5 py-0.5 rounded">
            TRUE PROCUREMENT COST
          </span>
        </div>

        {/* 3-Vendor Cost Waterfall Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quotes.map((q) => {
            const isWinner = q.isRecommendedWinner;
            const isTrap = q.vendorName.includes('Vendor B');
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border space-y-3 shadow-xs ${
                  isWinner
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/20'
                    : isTrap
                    ? 'border-[var(--danger)]/40 bg-[var(--danger-light)]/20'
                    : 'bg-[var(--surface)] border-[var(--border)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--foreground)]">{q.vendorName}</span>
                  {isTrap && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--danger-light)] text-[var(--danger)] border border-[var(--danger)]/30">
                      Hidden Surcharges
                    </span>
                  )}
                  {isWinner && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/40">
                      True Lowest Landed
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>Base Quoted:</span>
                    <span className="font-semibold">{formatCurrency(q.basePrice, currency, false)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground-muted)]">
                    <span>+ Shipping/Logistics:</span>
                    <span className={q.shippingCost > 0 ? 'text-[var(--danger)] font-semibold' : 'text-[var(--foreground-muted)]'}>
                      {formatCurrency(q.shippingCost, currency, false)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground-muted)]">
                    <span>+ Tax/Duties:</span>
                    <span>{formatCurrency(q.taxAmount, currency, false)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground-muted)]">
                    <span>+ Setup & Maintenance:</span>
                    <span>{formatCurrency(q.installationCost + q.maintenanceCost, currency, false)}</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border)] flex justify-between text-sm font-bold">
                    <span className="text-[var(--foreground)]">True Landed Cost:</span>
                    <span className={isWinner ? 'text-[var(--primary)]' : isTrap ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}>
                      {formatCurrency(q.trueCost.totalTrueCost, currency, false)}
                    </span>
                  </div>
                </div>

                {isTrap && (
                  <p className="text-[11px] text-[var(--danger)] leading-tight pt-2 border-t border-[var(--border)]">
                    Quoted base price appears lower initially, but unquoted shipping and customs creates a net increase in landed expenditure.
                  </p>
                )}
                {isWinner && (
                  <p className="text-[11px] text-[var(--primary)] leading-tight pt-2 border-t border-[var(--border)]">
                    All-inclusive DDP terms with zero hidden fees. Pure ₹49.0L landed cost with full 3-year on-site SLA.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. RISK & ANOMALY DETECTION PANEL */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Multi-Factor Risk & Anomaly Detection Panel
            </h2>
          </div>
          <span className="text-[10px] text-[var(--danger)] font-semibold">
            3 Risk Vectors Scanned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Risk 1: Vendor B FOB Hidden Surcharge */}
          <div className="p-4 rounded-lg bg-[var(--danger-light)] border border-[var(--danger)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--danger)] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[var(--danger)]" /> Price & Freight Anomaly
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--danger)] border border-[var(--danger)]/30">
                HIGH RISK
              </span>
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Vendor B: Kaohsiung Shipping Surcharge</div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Vendor unbundles freight and import duties (~₹6.0L), artificially lowering quoted sticker price. Buyer absorbs container risks.
            </p>
            <div className="text-[10px] text-[var(--foreground-muted)] pt-1 border-t border-[var(--border)]">
              Mitigation: Reject FOB; enforce DDP destination delivery.
            </div>
          </div>

          {/* Risk 2: Delivery Delay Violation */}
          <div className="p-4 rounded-lg bg-[var(--danger-light)] border border-[var(--danger)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--danger)] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--danger)]" /> Delivery SLA Breach
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--danger)] border border-[var(--danger)]/30">
                HIGH RISK
              </span>
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Vendor B: 18-Day Lead Time (Breaches 10-Day SLA)</div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Required delivery is 10 days for software engineering onboarding. Vendor B requires 18 days, causing 8-day operational slip.
            </p>
            <div className="text-[10px] text-[var(--foreground-muted)] pt-1 border-t border-[var(--border)]">
              Mitigation: Vendor C selected (delivers in 5 days).
            </div>
          </div>

          {/* Risk 3: Commercial Advance Cash Risk */}
          <div className="p-4 rounded-lg bg-[var(--primary-light)] border border-[var(--secondary)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--success)]" /> Commercial Term Safeguard
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--success)] border border-[var(--secondary)]/30">
                LOW RISK
              </span>
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Vendor C: Net 45 Days Working Capital Advantage</div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Vendor C requires zero advance cash deposit, preserving working capital and aligning with corporate treasury guidelines.
            </p>
            <div className="text-[10px] text-[var(--foreground-muted)] pt-1 border-t border-[var(--border)]">
              Mitigation: Compliant with enterprise credit policy.
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {winnerQuote && (
        <>
          <WhyVendorModal
            isOpen={isWhyModalOpen}
            onClose={() => setIsWhyModalOpen(false)}
            brief={brief}
            winnerQuote={winnerQuote}
            currency={currency}
            onApproveAndGeneratePo={() => onApproveAndGeneratePo(activeRfq, winnerQuote)}
          />

          <NegotiationModal
            isOpen={isNegotiateModalOpen}
            onClose={() => setIsNegotiateModalOpen(false)}
            vendorQuote={winnerQuote}
            currency={currency}
          />
        </>
      )}
    </div>
  );
};
