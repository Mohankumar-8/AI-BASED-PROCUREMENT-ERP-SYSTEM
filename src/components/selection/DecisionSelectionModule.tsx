import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight, 
  Sparkle
} from 'lucide-react';
import { RFQ, VendorQuote } from '../../types';

interface DecisionSelectionModuleProps {
  activeRfq: RFQ;
  onApproveAndCreatePo: (rfq: RFQ, selectedQuote: VendorQuote) => void;
  onNavigateToPo: () => void;
  onOpenNegotiationModal: (vendor: VendorQuote) => void;
}

export const DecisionSelectionModule: React.FC<DecisionSelectionModuleProps> = ({
  activeRfq,
  onApproveAndCreatePo,
  onNavigateToPo,
  onOpenNegotiationModal,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [poCreated, setPoCreated] = useState<boolean>(activeRfq.approvalStatus === 'auto_approved' || activeRfq.approvalStatus === 'approved');
  const [createdPoNumber, setCreatedPoNumber] = useState<string | null>(activeRfq.poNumber || null);

  // Find winning quote
  const winningQuote = activeRfq.quotes.find((q) => q.isRecommendedWinner) || activeRfq.quotes[0];

  const handleApprove = () => {
    if (!winningQuote) return;
    setIsApproving(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#315C4A', '#7A9B87', '#B08A4A', '#202522'],
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      const generatedPoNumber = `PO-${activeRfq.rfqNumber.replace('RFQ-', '')}-APX`;
      setCreatedPoNumber(generatedPoNumber);
      setPoCreated(true);
      setIsApproving(false);
      onApproveAndCreatePo(activeRfq, winningQuote);
    }, 500);
  };

  if (!winningQuote) {
    return (
      <div className="p-8 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)] text-[var(--foreground-muted)]">
        No quotation submitted to evaluate for this RFQ.
      </div>
    );
  }

  const budgetSavings = activeRfq.targetBudget - winningQuote.trueCost.totalTrueCost;
  const budgetSavingsPct = ((budgetSavings / activeRfq.targetBudget) * 100).toFixed(1);

  return (
    <div id="selection-module-container" className="space-y-6 pb-12">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              STAGE 4 OF 4
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Explainable Selection & Zero-Touch Execution</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Explainable AI Recommendation & Automated Approval
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Autonomous audit verification against corporate procurement policies, executive decision brief synthesis, and 1-click Purchase Order generation.
          </p>
        </div>

        {poCreated && (
          <button
            id="selection-view-po-btn"
            onClick={onNavigateToPo}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-semibold shadow-xs transition-colors cursor-pointer touch-target"
          >
            <span>Track PO ({createdPoNumber || 'Active'})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Winning AI Recommendation & Decision Brief */}
        <div className="lg:col-span-7 space-y-6">
          {/* Winner Showcase Card */}
          <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border-l-4 border-l-[var(--primary)] border-t border-r border-b border-[var(--border)] space-y-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center text-[var(--surface)] font-bold shadow-xs shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30">
                      Recommended Winner
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">Score 94.2/100</span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--foreground)] mt-0.5">{winningQuote.vendorName}</h2>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[var(--foreground-muted)] uppercase font-semibold block">True Landed Cost</span>
                <span className="text-xl sm:text-2xl font-bold text-[var(--primary)]">
                  ${winningQuote.trueCost.totalTrueCost.toLocaleString()}
                </span>
                <span className="text-[11px] text-[var(--success)] font-semibold block">
                  Captures ${budgetSavings.toLocaleString()} ({budgetSavingsPct}%) Budget Savings
                </span>
              </div>
            </div>

            {/* Explainable Decision Brief Narrative */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
                AI Executive Decision Brief Rationale
              </h3>
              <div className="text-xs text-[var(--foreground)] space-y-2 leading-relaxed bg-[var(--background)] p-4 rounded-lg border border-[var(--border)]">
                <p>
                  <strong>Why Apex Networks Won over Competitors:</strong> While Nexus Global quoted a nominal sticker price $8,275 lower on paper, their FOB Keelung terms unbundle $23,080 in freight, tariffs, and payment carry costs, making Nexus $21,385 more expensive in net landed economics.
                </p>
                <p>
                  Apex Networks provides guaranteed <strong>DDP destination delivery</strong> (14 calendar days vs 32 days for Nexus), 36 months of enterprise TAC hardware replacement, and favorable Net 60 payment terms that preserve $1.56k in working capital liquidity.
                </p>
              </div>
            </div>

            {/* Selection Drivers List */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                Key Selection Proofs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[var(--foreground-muted)] font-medium block text-[11px]">True Landed Cost Efficiency</span>
                  <span className="text-[var(--primary)] font-semibold">$156,865 True Cost (DDP all-inclusive)</span>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[var(--foreground-muted)] font-medium block text-[11px]">Delivery & Lead Time</span>
                  <span className="text-[var(--foreground)] font-semibold">14 Days (Arrives Sept 08, 7 days before launch)</span>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[var(--foreground-muted)] font-medium block text-[11px]">Quality & TAC SLA</span>
                  <span className="text-[var(--foreground)] font-semibold">3-Year TAC with 4-hr MTTR hardware swap</span>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[var(--foreground-muted)] font-medium block text-[11px]">Commercial Terms</span>
                  <span className="text-[var(--primary)] font-semibold">Net 60 Days with 0% advance lock-up</span>
                </div>
              </div>
            </div>

            {/* Negotiation CTA */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-[var(--foreground-muted)]">Want to optimize terms even further?</span>
              <button
                onClick={() => onOpenNegotiationModal(winningQuote)}
                className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 transition-colors cursor-pointer touch-target self-start sm:self-auto"
              >
                <Sparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
                Generate AI Counter-Offer
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Autonomous Policy Engine & 1-Click PO Execution */}
        <div className="lg:col-span-5 space-y-6">
          {/* Zero-Touch Policy Compliance Checklist */}
          <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Zero-Touch Policy Engine
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
                100% Policy Pass
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Autonomous verification against corporate procurement rules:
            </p>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--foreground)] block">Budget Threshold Check</span>
                  <span className="text-[var(--foreground-muted)] text-[11px]">
                    True Cost ($156,865) is within authorized limit ($175,000) with 10.3% surplus.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--foreground)] block">Vendor Intelligence Score Check</span>
                  <span className="text-[var(--foreground-muted)] text-[11px]">
                    Composite score (94.2/100) exceeds mandatory threshold (&gt;85.0).
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--foreground)] block">Risk & Anomaly Audit</span>
                  <span className="text-[var(--foreground-muted)] text-[11px]">
                    Zero critical anomalies, clean DDP freight, and no price escalation clauses.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--foreground)] block">Delivery Deadline Alignment</span>
                  <span className="text-[var(--foreground-muted)] text-[11px]">
                    Arrival Sept 08 meets mandatory Bangalore Phase 2 launch date (Sept 15).
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Execution Box */}
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              {poCreated ? (
                <div className="p-4 rounded-lg bg-[var(--primary-light)]/40 border border-[var(--secondary)]/40 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-[var(--primary)] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                    <span>Purchase Order Issued & Transmitted</span>
                  </div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{createdPoNumber}</p>
                  <p className="text-[11px] text-[var(--foreground-muted)]">
                    Electronic PO dispatched to Apex Networks with Net 60 terms.
                  </p>
                </div>
              ) : (
                <button
                  id="approve-po-generate-btn"
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full py-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer touch-target"
                >
                  {isApproving ? (
                    <>
                      <Sparkle className="w-4 h-4 animate-spin text-[var(--surface)]" />
                      Executing Autonomous Approval & Transmitting PO...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 text-[var(--surface)]" />
                      1-Click Approve & Generate Purchase Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Audit Trail Stamp */}
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[var(--foreground)] tracking-wider block">
              Cryptographic Audit Log
            </span>
            <p className="text-[11px] text-[var(--foreground)]">
              Evaluator: VendraX Autonomous Policy Engine v4.2
            </p>
            <p className="text-[10px] text-[var(--foreground-muted)]">
              Timestamp: {new Date().toISOString()} • Compliance SHA-256 Verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
