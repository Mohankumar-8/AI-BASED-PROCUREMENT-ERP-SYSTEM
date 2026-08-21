import React, { useState } from 'react';
import { 
  Scale, 
  DollarSign, 
  AlertTriangle, 
  Award, 
  ArrowRight, 
  Sliders, 
  Sparkle, 
  FileSpreadsheet,
  Check,
  X,
  Zap
} from 'lucide-react';
import { RFQ, VendorQuote } from '../../types';

interface ComparisonEngineModuleProps {
  activeRfq: RFQ;
  onProceedToSelection: () => void;
  onOpenNegotiationModal: (vendor: VendorQuote) => void;
}

export const ComparisonEngineModule: React.FC<ComparisonEngineModuleProps> = ({
  activeRfq,
  onProceedToSelection,
  onOpenNegotiationModal,
}) => {
  // Evaluation Weight Sliders State
  const [weights, setWeights] = useState({
    price: 30,
    quality: 25,
    delivery: 20,
    risk: 15,
    esg: 10,
  });

  const [activeComparisonTab, setActiveComparisonTab] = useState<'true_cost' | 'scores' | 'matrix' | 'anomalies'>('true_cost');

  const quotes = activeRfq.quotes;

  // Compute dynamic scores based on custom weights
  const calculateDynamicScore = (q: VendorQuote) => {
    const raw = q.vendorScore;
    const totalWeight = weights.price + weights.quality + weights.delivery + weights.risk + weights.esg;
    const score = (
      raw.priceScore * weights.price +
      raw.qualityScore * weights.quality +
      raw.deliveryScore * weights.delivery +
      raw.riskScore * weights.risk +
      raw.esgScore * weights.esg
    ) / totalWeight;
    return parseFloat(score.toFixed(1));
  };

  // Sort quotes by dynamic score
  const sortedQuotes = [...quotes].sort((a, b) => calculateDynamicScore(b) - calculateDynamicScore(a));

  return (
    <div id="comparison-engine-container" className="space-y-6 pb-12">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#EEF5F1] text-[#315C4A] border border-[#7A9B87]/30">
              STAGE 3 OF 4
            </span>
            <span className="text-xs text-[#5D756D] font-medium">True Cost & Multi-Factor Intelligence Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-[#202522] tracking-tight">
            Vendor Comparison & True Cost Modeling
          </h1>
          <p className="text-xs text-[#5D756D] max-w-2xl leading-relaxed">
            Normalize nominal quotation prices into <strong>Total True Landed Cost (TCO)</strong> factoring logistics, customs tariffs, payment term carrying costs, and defect risk buffers.
          </p>
        </div>

        <button
          id="comparison-proceed-to-selection-btn"
          onClick={onProceedToSelection}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>Explainable Decision & Zero-Touch Approval</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Flagship Insight: False Economy Alert Banner */}
      {quotes.length >= 2 && (
        <div className="p-5 rounded-xl bg-[#FCFAF5] border-l-4 border-l-[#315C4A] border-t border-r border-b border-[#E8DFD0] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#EEF5F1] border border-[#7A9B87]/30 flex items-center justify-center text-[#315C4A] shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#202522]">AI True Cost Breakthrough: False Economy Trap Exposed</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF4E8] text-[#B08A4A] border border-[#B08A4A]/30">
                  TCO Optimization
                </span>
              </div>
              <p className="text-xs text-[#5D756D] mt-1 leading-relaxed max-w-3xl">
                On paper, <strong className="text-[#B6534A]">Nexus Global</strong> quotes $148,000 ($8,275 cheaper nominal sticker than Apex). However, their <strong className="text-[#B6534A]">FOB terms</strong> force buyer-paid air freight (+$14.2k), import tariffs (+$8.88k), 30% advance capital lock-up (+$2.95k), and 2-year warranty extension (+$6.7k) — pushing their <strong>True Landed Cost to $178,250</strong>. <strong className="text-[#315C4A]">Apex Networks DDP ($156,865 True Cost) saves $21,385 overall.</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveComparisonTab('true_cost')}
              className="px-3.5 py-2 rounded-lg bg-[#315C4A] text-[#F7F4EE] text-xs font-semibold hover:bg-[#264A3B] transition-colors cursor-pointer"
            >
              Inspect Waterfall
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8DFD0] pb-2 overflow-x-auto">
        <button
          id="tab-btn-true-cost"
          onClick={() => setActiveComparisonTab('true_cost')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeComparisonTab === 'true_cost'
              ? 'bg-[#315C4A] text-[#F7F4EE]'
              : 'text-[#5D756D] hover:text-[#202522] hover:bg-[#E8DFD0]/40'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>True Cost Waterfall Breakdown</span>
        </button>

        <button
          id="tab-btn-scores"
          onClick={() => setActiveComparisonTab('scores')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeComparisonTab === 'scores'
              ? 'bg-[#315C4A] text-[#F7F4EE]'
              : 'text-[#5D756D] hover:text-[#202522] hover:bg-[#E8DFD0]/40'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Multi-Factor Vendor Scoring</span>
        </button>

        <button
          id="tab-btn-matrix"
          onClick={() => setActiveComparisonTab('matrix')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeComparisonTab === 'matrix'
              ? 'bg-[#315C4A] text-[#F7F4EE]'
              : 'text-[#5D756D] hover:text-[#202522] hover:bg-[#E8DFD0]/40'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Specification & SLA Matrix</span>
        </button>

        <button
          id="tab-btn-anomalies"
          onClick={() => setActiveComparisonTab('anomalies')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeComparisonTab === 'anomalies'
              ? 'bg-[#315C4A] text-[#F7F4EE]'
              : 'text-[#5D756D] hover:text-[#202522] hover:bg-[#E8DFD0]/40'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Contract Anomalies & Risks</span>
        </button>
      </div>

      {/* Tab 1: True Cost Waterfall Breakdown */}
      {activeComparisonTab === 'true_cost' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((q) => {
              const tc = q.trueCost;
              const isWinner = q.isRecommendedWinner;
              const isRisky = q.riskLevel === 'HIGH';
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-xl border flex flex-col justify-between transition-colors shadow-xs ${
                    isWinner
                      ? 'bg-[#EEF5F1]/60 border-[#315C4A]'
                      : isRisky
                      ? 'bg-[#FBF0EE]/60 border-[#B6534A]/40'
                      : 'bg-[#FCFAF5] border-[#E8DFD0]'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E8DFD0]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#202522]">{q.vendorName}</h3>
                          {isWinner && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#315C4A] text-[#F7F4EE] flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Top True Value
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#5D756D]">
                          {q.incoterms} • {q.paymentTerms}
                        </span>
                      </div>
                    </div>

                    {/* True Cost Primary Number */}
                    <div className="py-4 space-y-1">
                      <span className="text-[11px] text-[#5D756D] uppercase font-semibold block">
                        Total True Landed Cost
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${isWinner ? 'text-[#315C4A]' : isRisky ? 'text-[#B6534A]' : 'text-[#202522]'}`}>
                          ${tc.totalTrueCost.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#5D756D]">
                          (${tc.unitTrueCost}/unit)
                        </span>
                      </div>
                      <div className="text-xs flex items-center gap-1.5 pt-0.5">
                        <span className="text-[#5D756D]">Quoted Sticker:</span>
                        <span className="line-through text-[#5D756D]">
                          ${tc.stickerPrice.toLocaleString()}
                        </span>
                        <span className={`font-semibold text-[11px] ${tc.totalTrueCost > tc.stickerPrice ? 'text-[#B6534A]' : 'text-[#4F7A5A]'}`}>
                          ({tc.totalTrueCost > tc.stickerPrice ? `+$${(tc.totalTrueCost - tc.stickerPrice).toLocaleString()} hidden` : `-$${(tc.stickerPrice - tc.totalTrueCost).toLocaleString()} net`})
                        </span>
                      </div>
                    </div>

                    {/* Waterfall Components List */}
                    <div className="space-y-2 py-3 border-t border-[#E8DFD0] text-xs">
                      <div className="flex justify-between items-center text-[#202522]">
                        <span className="text-[#5D756D]">Base Quoted Price</span>
                        <span className="font-semibold">${tc.stickerPrice.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center text-[#202522]">
                        <span className="text-[#5D756D]">Freight & Logistics</span>
                        <span className={tc.shippingAndLogistics > 0 ? 'text-[#B6534A] font-semibold' : 'text-[#4F7A5A]'}>
                          {tc.shippingAndLogistics > 0 ? `+$${tc.shippingAndLogistics.toLocaleString()}` : '$0 (DDP)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[#202522]">
                        <span className="text-[#5D756D]">Import Duty & Tariffs</span>
                        <span className={tc.importDutyAndTariff > 0 ? 'text-[#B6534A] font-semibold' : 'text-[#4F7A5A]'}>
                          {tc.importDutyAndTariff > 0 ? `+$${tc.importDutyAndTariff.toLocaleString()}` : '$0 (DDP)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[#202522]">
                        <span className="text-[#5D756D]">Payment Carry Cost</span>
                        <span className={tc.paymentTermCarryCost > 0 ? 'text-[#B6534A]' : 'text-[#4F7A5A]'}>
                          {tc.paymentTermCarryCost > 0 ? `+$${tc.paymentTermCarryCost.toLocaleString()}` : `-$${Math.abs(tc.paymentTermCarryCost).toLocaleString()}`}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[#202522]">
                        <span className="text-[#5D756D]">Defect & RMA Buffer</span>
                        <span className={tc.defectAndRiskBuffer > 2000 ? 'text-[#B6534A] font-semibold' : 'text-[#5D756D]'}>
                          +${tc.defectAndRiskBuffer.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[#202522]">
                        <span className="text-[#5D756D]">Extended Support TCO</span>
                        <span className={tc.maintenanceAndExtendedSupport > 0 ? 'text-[#B08A4A]' : 'text-[#5D756D]'}>
                          {tc.maintenanceAndExtendedSupport > 0 ? `+$${tc.maintenanceAndExtendedSupport.toLocaleString()}` : '$0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#E8DFD0] space-y-2">
                    <button
                      onClick={() => onOpenNegotiationModal(q)}
                      className="w-full py-2 px-3 rounded-lg bg-[#FCFAF5] hover:bg-[#E8DFD0]/40 text-[#202522] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DFD0] cursor-pointer"
                    >
                      <Sparkle className="w-3.5 h-3.5 text-[#B08A4A]" />
                      <span>Draft Counter-Offer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Multi-Factor Vendor Scoring & Dynamic Sliders */}
      {activeComparisonTab === 'scores' && (
        <div className="space-y-6">
          {/* Interactive Weighting Sliders */}
          <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-[#315C4A]" />
                <h3 className="text-sm font-bold text-[#202522] uppercase tracking-wider">
                  Interactive Evaluation Weight Sliders
                </h3>
              </div>
              <span className="text-xs text-[#5D756D]">
                Adjust criteria weighting to simulate executive priorities:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#202522] font-medium">Price (TCO)</span>
                  <span className="text-[#315C4A] font-bold">{weights.price}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.price}
                  onChange={(e) => setWeights({ ...weights, price: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E8DFD0] rounded-lg appearance-none cursor-pointer accent-[#315C4A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#202522] font-medium">Quality & SLA</span>
                  <span className="text-[#315C4A] font-bold">{weights.quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.quality}
                  onChange={(e) => setWeights({ ...weights, quality: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E8DFD0] rounded-lg appearance-none cursor-pointer accent-[#315C4A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#202522] font-medium">Delivery Speed</span>
                  <span className="text-[#315C4A] font-bold">{weights.delivery}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.delivery}
                  onChange={(e) => setWeights({ ...weights, delivery: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E8DFD0] rounded-lg appearance-none cursor-pointer accent-[#315C4A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#202522] font-medium">Risk & Compliance</span>
                  <span className="text-[#315C4A] font-bold">{weights.risk}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.risk}
                  onChange={(e) => setWeights({ ...weights, risk: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E8DFD0] rounded-lg appearance-none cursor-pointer accent-[#315C4A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#202522] font-medium">ESG & Stability</span>
                  <span className="text-[#315C4A] font-bold">{weights.esg}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={weights.esg}
                  onChange={(e) => setWeights({ ...weights, esg: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E8DFD0] rounded-lg appearance-none cursor-pointer accent-[#315C4A]"
                />
              </div>
            </div>
          </div>

          {/* Ranking Cards with dynamic score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedQuotes.map((q, rankIdx) => {
              const dynamicScore = calculateDynamicScore(q);
              const isFirst = rankIdx === 0;
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-xl border space-y-4 shadow-xs ${
                    isFirst
                      ? 'bg-[#EEF5F1]/70 border-[#315C4A]'
                      : 'bg-[#FCFAF5] border-[#E8DFD0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                        isFirst ? 'bg-[#315C4A] text-[#F7F4EE]' : 'bg-[#E8DFD0] text-[#5D756D]'
                      }`}>
                        #{rankIdx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-[#202522]">{q.vendorName}</h4>
                        <span className="text-[11px] text-[#5D756D]">{q.vendorCountry}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#5D756D] uppercase font-semibold block">Score</span>
                      <span className={`text-xl font-bold ${
                        dynamicScore >= 85 ? 'text-[#315C4A]' : dynamicScore >= 75 ? 'text-[#202522]' : 'text-[#B6534A]'
                      }`}>
                        {dynamicScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Factor Breakdown Bars */}
                  <div className="space-y-2 pt-2 border-t border-[#E8DFD0] text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#5D756D]">Price Competitiveness</span>
                        <span className="text-[#202522] font-semibold">{q.vendorScore.priceScore}/100</span>
                      </div>
                      <div className="w-full bg-[#E8DFD0] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#315C4A] h-full" style={{ width: `${q.vendorScore.priceScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#5D756D]">Quality & TAC SLA</span>
                        <span className="text-[#202522] font-semibold">{q.vendorScore.qualityScore}/100</span>
                      </div>
                      <div className="w-full bg-[#E8DFD0] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#315C4A] h-full" style={{ width: `${q.vendorScore.qualityScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#5D756D]">Delivery Lead Time</span>
                        <span className="text-[#202522] font-semibold">{q.vendorScore.deliveryScore}/100</span>
                      </div>
                      <div className="w-full bg-[#E8DFD0] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#4F7A5A] h-full" style={{ width: `${q.vendorScore.deliveryScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#5D756D]">Financial & Risk Score</span>
                        <span className="text-[#202522] font-semibold">{q.vendorScore.riskScore}/100</span>
                      </div>
                      <div className="w-full bg-[#E8DFD0] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#B08A4A] h-full" style={{ width: `${q.vendorScore.riskScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Strengths / Weaknesses */}
                  <div className="pt-3 border-t border-[#E8DFD0] text-[11px] space-y-1.5">
                    {q.vendorScore.strengths.slice(0, 2).map((s, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-1.5 text-[#315C4A]">
                        <Check className="w-3 h-3 text-[#4F7A5A] shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                    {q.vendorScore.weaknesses.slice(0, 2).map((w, wIdx) => (
                      <div key={wIdx} className="flex items-start gap-1.5 text-[#B6534A]">
                        <X className="w-3 h-3 text-[#B6534A] shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Deep Matrix Table */}
      {activeComparisonTab === 'matrix' && (
        <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-[#5D756D] font-semibold">
                <th className="py-3 px-4 w-1/4">Evaluation Parameter</th>
                {quotes.map((q) => (
                  <th key={q.id} className="py-3 px-4 font-bold text-[#202522] text-sm">
                    {q.vendorName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              <tr>
                <td className="py-3 px-4 text-[#5D756D] font-medium">Nominal Quoted Price</td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4 font-semibold text-[#202522]">
                    ${q.quotedTotal.toLocaleString()}
                  </td>
                ))}
              </tr>

              <tr className="bg-[#EEF5F1]/40">
                <td className="py-3 px-4 text-[#315C4A] font-bold flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-[#B08A4A]" />
                  Total True Landed Cost (TCO)
                </td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4 font-bold text-[#315C4A]">
                    ${q.trueCost.totalTrueCost.toLocaleString()}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 text-[#5D756D] font-medium">Incoterms</td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      q.incoterms === 'DDP' ? 'bg-[#EEF5F1] text-[#4F7A5A] border border-[#7A9B87]/30' : 'bg-[#FBF0EE] text-[#B6534A] border border-[#B6534A]/30'
                    }`}>
                      {q.incoterms}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 text-[#5D756D] font-medium">Payment Terms</td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4 text-[#202522]">
                    {q.paymentTerms}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 text-[#5D756D] font-medium">Lead Time to Site</td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4 text-[#202522]">
                    {q.deliveryLeadTimeDays} Calendar Days
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 text-[#5D756D] font-medium">Warranty & On-Site SLA</td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4 text-[#202522]">
                    {q.warrantyPeriodMonths} Months ({q.slaUptimeCommitment})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 text-[#5D756D] font-medium">Detected Risk Flags</td>
                {quotes.map((q) => (
                  <td key={q.id} className="py-3 px-4">
                    {q.anomalies.length === 0 ? (
                      <span className="text-[#4F7A5A] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Clean (0 Flags)
                      </span>
                    ) : (
                      <span className="text-[#B6534A] font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {q.anomalies.length} Flags Detected
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Anomalies & Risk Matrix */}
      {activeComparisonTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#202522] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B6534A]" />
              Autonomous Contract & Risk Anomaly Audit
            </h3>
            <p className="text-xs text-[#5D756D]">
              VendraX AI scans each clause against market procurement standards to flag hidden freight charges, deadline risks, and price escalation clauses:
            </p>

            <div className="space-y-3 pt-2">
              {quotes.flatMap((q) => q.anomalies.map((a) => ({ ...a, vendorName: q.vendorName }))).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`p-4 rounded-lg border ${
                    anomaly.severity === 'critical'
                      ? 'bg-[#FBF0EE] border-[#B6534A]/30'
                      : 'bg-[#FAF4E8] border-[#B08A4A]/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#202522]">{anomaly.vendorName}: {anomaly.title}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#FCFAF5] font-semibold text-[#B6534A] border border-[#B6534A]/30">
                        {anomaly.severity}
                      </span>
                    </div>
                    <span className="text-xs text-[#5D756D]">
                      Penalty: -{anomaly.impactScore} pts
                    </span>
                  </div>

                  <p className="text-xs text-[#5D756D] leading-relaxed mb-2.5">
                    {anomaly.description}
                  </p>

                  <div className="text-xs p-2.5 rounded-lg bg-[#FCFAF5] border border-[#E8DFD0] text-[#202522]">
                    <strong className="text-[#315C4A]">Mandated Mitigation:</strong> {anomaly.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
