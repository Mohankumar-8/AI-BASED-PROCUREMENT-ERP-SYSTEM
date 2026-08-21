import React, { useState } from 'react';
import { 
  Search, 
  Star
} from 'lucide-react';
import { VendorProfile, RiskLevel } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface VendorIntelligenceModuleProps {
  vendors: VendorProfile[];
  currency: 'INR' | 'USD';
}

export const VendorIntelligenceModule: React.FC<VendorIntelligenceModuleProps> = ({
  vendors,
  currency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedVendorDetail, setSelectedVendorDetail] = useState<VendorProfile | null>(vendors[0] || null);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.legalEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = selectedRiskFilter === 'ALL' || v.riskLevel === selectedRiskFilter;
    const matchesCategory = selectedCategoryFilter === 'ALL' || v.category.includes(selectedCategoryFilter);
    return matchesSearch && matchesRisk && matchesCategory;
  });

  return (
    <div id="vendor-intelligence-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              VENDOR INTELLIGENCE & SCORING
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">B2B Supplier Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Vendor Scorecards & Historical Risk Profiles
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Autonomous performance scoring, historical on-time delivery benchmarks, defect rate telemetry, and ESG compliance tracking.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor name, tag, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] touch-target"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none touch-target"
          >
            <option value="ALL">All Categories</option>
            <option value="IT Hardware">IT Hardware</option>
            <option value="Facility & Office">Facility & Office</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
          </select>

          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value as any)}
            className="w-full sm:w-auto bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none touch-target"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW">LOW Risk Only</option>
            <option value="MEDIUM">MEDIUM Risk</option>
            <option value="HIGH">HIGH Risk</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid: Vendor Directory Cards + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Vendor Cards */}
        <div className="lg:col-span-6 space-y-3">
          {filteredVendors.map((vendor) => {
            const isSelected = selectedVendorDetail?.id === vendor.id;
            return (
              <div
                key={vendor.id}
                onClick={() => setSelectedVendorDetail(vendor)}
                className={`p-4 rounded-xl bg-[var(--surface)] border cursor-pointer transition-colors space-y-3 shadow-xs ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/30'
                    : 'border-[var(--border)] hover:border-[var(--primary)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[var(--foreground)]">{vendor.name}</h3>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                        vendor.tier === 'Preferred'
                          ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--secondary)]/30'
                          : 'bg-[var(--background)] text-[var(--foreground-muted)] border-[var(--border)]'
                      }`}>
                        {vendor.tier}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{vendor.headquarters}</div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    vendor.riskLevel === 'LOW'
                      ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                      : 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30'
                  }`}>
                    {vendor.riskLevel} RISK
                  </span>
                </div>

                {/* 4 Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--foreground-muted)] block">Reliability</span>
                    <span className="font-bold text-[var(--success)]">{vendor.reliabilityScore}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--foreground-muted)] block">On-Time %</span>
                    <span className="font-bold text-[var(--primary)]">{vendor.historicalOnTimeDeliveryPct}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--foreground-muted)] block">Quality</span>
                    <span className="font-bold text-[var(--foreground)]">{vendor.qualityScore}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--foreground-muted)] block">Defect Rate</span>
                    <span className={`font-bold ${vendor.historicalDefectRatePct < 1 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {vendor.historicalDefectRatePct}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--foreground-muted)] pt-2 border-t border-[var(--border)]">
                  <span>Total Spend: {formatCurrency(vendor.totalSpendYTD, currency, true)} ({vendor.completedOrdersCount} POs)</span>
                  <span className="text-[var(--primary)] font-semibold flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 6 Cols: Selected Vendor Detailed Intelligence Dossier */}
        <div className="lg:col-span-6">
          {selectedVendorDetail ? (
            <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5 shadow-xs lg:sticky lg:top-20">
              <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[var(--foreground)]">{selectedVendorDetail.name}</span>
                    <span className="text-xs text-[var(--accent)] font-semibold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" /> {selectedVendorDetail.rating}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">{selectedVendorDetail.legalEntity}</div>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                  selectedVendorDetail.riskLevel === 'LOW'
                    ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                    : 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30'
                }`}>
                  {selectedVendorDetail.riskLevel} RISK
                </span>
              </div>

              {/* Contact & Commercial Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Account Manager</span>
                  <div className="font-bold text-[var(--foreground)]">{selectedVendorDetail.contactName}</div>
                  <div className="text-[11px] text-[var(--foreground-muted)]">{selectedVendorDetail.contactEmail}</div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] text-[var(--foreground-muted)] uppercase font-semibold">Standard Payment Terms</span>
                  <div className="font-bold text-[var(--primary)]">{selectedVendorDetail.paymentTermsStandard}</div>
                  <div className="text-[11px] text-[var(--foreground-muted)]">Price Tier: {selectedVendorDetail.averagePriceTier}</div>
                </div>
              </div>

              {/* Tags & Badges */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">
                  Vendor Tags & Certifications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVendorDetail.certifications.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[var(--background)] text-[var(--primary)] border border-[var(--border)]">
                      {c}
                    </span>
                  ))}
                  {selectedVendorDetail.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical Performance Quarters */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">
                  Quarterly Performance History
                </span>
                <div className="space-y-1.5">
                  {selectedVendorDetail.performanceHistory.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--foreground)]">{q.period}</span>
                      <span className="text-[var(--success)] font-semibold">{q.onTimePct}% On-Time</span>
                      <span className="text-[var(--primary)] font-semibold">{q.qualityPct}% Quality</span>
                      <span className="text-[var(--foreground-muted)]">{formatCurrency(q.spendAmount, currency, true)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center text-[var(--foreground-muted)]">
              Select a vendor to inspect detailed performance dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
