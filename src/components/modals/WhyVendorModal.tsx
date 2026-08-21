import React from 'react';
import { 
  CheckCircle2, 
  Award, 
  Zap,
  X
} from 'lucide-react';
import { ExplainableDecisionBrief, VendorQuote } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface WhyVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: ExplainableDecisionBrief;
  winnerQuote: VendorQuote;
  currency: 'INR' | 'USD';
  onApproveAndGeneratePo: () => void;
}

export const WhyVendorModal: React.FC<WhyVendorModalProps> = ({
  isOpen,
  onClose,
  brief,
  currency,
  onApproveAndGeneratePo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 sm:p-7 space-y-5 sm:space-y-6 shadow-xl relative my-auto text-[var(--foreground)]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
                EXPLAINABLE AI DECISION ENGINE
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">Confidence: {brief.confidenceScorePct}%</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2 flex-wrap">
              <span>Why {brief.winnerVendorName}?</span>
              <span className="text-xs sm:text-sm text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded font-semibold border border-[var(--secondary)]/30">
                Score: {brief.winnerScore}/100
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center justify-center text-sm transition-colors cursor-pointer touch-target shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Executive Summary Quote Box */}
        <div className="p-4 rounded-lg bg-[var(--primary-light)]/60 border border-[var(--secondary)]/40 space-y-2">
          <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold text-xs">
            <Award className="w-4 h-4 text-[var(--primary)]" />
            <span>AI Synthesis & Recommendation Rationale</span>
          </div>
          <p className="text-[var(--foreground)] text-xs leading-relaxed">
            "{brief.executiveSummary}"
          </p>
        </div>

        {/* 4 Core Selection Drivers */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--primary)]" />
            <span>Key Selection Drivers vs Competitors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {brief.keySelectionDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1.5"
              >
                <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                  <span>{driver.driver}</span>
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)] leading-snug">
                  {driver.impact}
                </p>
                <div className="text-[10px] text-[var(--primary)] font-semibold pt-1 border-t border-[var(--border)]">
                  Advantage: {driver.advantageVsNextBest}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Sensitivity Scenarios */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--accent)]" />
            <span>What-If Sensitivity Analysis</span>
          </h3>

          <div className="space-y-2">
            {brief.whatIfSensitivityAnalysis.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[var(--accent-light)] border border-[var(--accent)]/30 text-xs space-y-1"
              >
                <div className="font-semibold text-[var(--accent)] text-[11px]">
                  Scenario: {item.scenario}
                </div>
                <div className="text-[var(--foreground-muted)] text-[11px]">
                  Outcome: {item.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--success)] font-bold">
            Expected Savings: {formatCurrency(brief.expectedSavingsINR, currency, false)}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground)] text-xs font-semibold transition-colors border border-[var(--border)] cursor-pointer touch-target text-center"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApproveAndGeneratePo();
              }}
              className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-target"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Generate PO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
