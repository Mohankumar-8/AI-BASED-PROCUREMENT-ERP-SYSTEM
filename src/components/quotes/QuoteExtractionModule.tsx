import React, { useState } from 'react';
import { 
  FileSearch, 
  UploadCloud, 
  Sparkle, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  Scale
} from 'lucide-react';
import { RFQ, VendorQuote, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { sampleQuotesLaptopRfq } from '../../data/mockData';

interface QuoteExtractionModuleProps {
  activeRfq: RFQ;
  quotes: VendorQuote[];
  onUploadQuote: (quote: VendorQuote) => void;
  onLoadSampleQuotes: (sampleQuotes: VendorQuote[]) => void;
  onNavigate: (stage: ProcurementStage) => void;
  currency: 'INR' | 'USD';
}

export const QuoteExtractionModule: React.FC<QuoteExtractionModuleProps> = ({
  activeRfq,
  quotes,
  onUploadQuote,
  onLoadSampleQuotes,
  onNavigate,
  currency,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // One-click quick loaders
  const handleLoadSampleQuotes = () => {
    setIsProcessing(true);
    setUploadFeedback('Parsing 3 incoming vendor quotes (Vendor A, Vendor B, Vendor C) via AI OCR...');
    setTimeout(() => {
      onLoadSampleQuotes(sampleQuotesLaptopRfq);
      setIsProcessing(false);
      setUploadFeedback('Successfully ingested and extracted line items for 3 quotations.');
    }, 600);
  };

  const handleSimulatedSingleUpload = (vendorPreset: 'Vendor A' | 'Vendor B' | 'Vendor C') => {
    setIsProcessing(true);
    setUploadFeedback(`Extracting quotation line items from ${vendorPreset}...`);
    setTimeout(() => {
      const match = sampleQuotesLaptopRfq.find((q) => q.vendorName.includes(vendorPreset));
      if (match) {
        onUploadQuote(match);
      }
      setIsProcessing(false);
      setUploadFeedback(`Extracted ${vendorPreset} commercial terms with 98% AI confidence.`);
    }, 500);
  };

  return (
    <div id="quote-extraction-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#EEF5F1] text-[#315C4A] border border-[#7A9B87]/30">
              QUOTATION EXTRACTION ENGINE
            </span>
            <span className="text-xs text-[#5D756D] font-medium">Multimodal AI Ingestion</span>
          </div>
          <h1 className="text-2xl font-bold text-[#202522] tracking-tight">
            Vendor Quotations Ingestion & AI Line-Item OCR
          </h1>
          <p className="text-xs text-[#5D756D] max-w-2xl leading-relaxed">
            Upload vendor proposals in PDF, Excel, or scan format. VendraX automatically extracts line items, uncovers hidden freight clauses, checks Incoterms, and normalizes landed pricing.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai_analysis')}
          className="px-5 py-2.5 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] font-semibold text-xs shadow-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <Scale className="w-4 h-4" />
          <span>Analyze Quotations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Zone & Quick Ingestion Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Drag and Drop Zone */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleLoadSampleQuotes();
            }}
            className={`p-8 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
              dragActive
                ? 'border-[#315C4A] bg-[#EEF5F1]'
                : 'border-[#E8DFD0] hover:border-[#315C4A] bg-[#FCFAF5]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#EEF5F1] border border-[#7A9B87]/30 flex items-center justify-center text-[#315C4A]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202522]">Drag & drop vendor quotation files here</h3>
              <p className="text-xs text-[#5D756D] mt-1">
                Supports <strong className="text-[#202522]">PDF</strong>, <strong className="text-[#202522]">Excel (.xlsx)</strong>, and scanned quote images
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleLoadSampleQuotes}
                className="px-4 py-2 rounded-lg bg-[#F7F4EE] hover:bg-[#E8DFD0]/50 text-[#202522] text-xs font-semibold border border-[#E8DFD0] transition-colors cursor-pointer"
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Quick Demo Ingest Presets */}
          <div className="p-4 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#202522] uppercase tracking-wider">
                Instant Demo Quotation Loaders:
              </span>
              <span className="text-[10px] text-[#315C4A] font-semibold">1-Click Test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleSimulatedSingleUpload('Vendor C')}
                className="p-2.5 rounded-lg bg-[#EEF5F1] border border-[#7A9B87]/40 hover:border-[#315C4A] text-left text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#315C4A]">Vendor C PDF</div>
                <div className="text-[10px] text-[#5D756D]">₹49L (DDP All-Incl)</div>
              </button>

              <button
                onClick={() => handleSimulatedSingleUpload('Vendor A')}
                className="p-2.5 rounded-lg bg-[#F7F4EE] border border-[#E8DFD0] hover:border-[#315C4A] text-left text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#202522]">Vendor A PDF</div>
                <div className="text-[10px] text-[#5D756D]">₹48L + ₹2L Freight</div>
              </button>

              <button
                onClick={() => handleSimulatedSingleUpload('Vendor B')}
                className="p-2.5 rounded-lg bg-[#FBF0EE] border border-[#B6534A]/30 hover:border-[#B6534A] text-left text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#B6534A]">Vendor B Excel</div>
                <div className="text-[10px] text-[#5D756D]">₹44L FOB Trap</div>
              </button>
            </div>
          </div>

          {uploadFeedback && (
            <div className="p-3 rounded-lg bg-[#EEF5F1] border border-[#7A9B87]/30 text-[#315C4A] text-xs flex items-center gap-2 font-medium">
              <Sparkle className="w-4 h-4 text-[#B08A4A] shrink-0" />
              <span>{uploadFeedback}</span>
            </div>
          )}
        </div>

        {/* Right 6 Cols: Ingested Quotes Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD0]">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-[#315C4A]" />
                <h2 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                  Extracted Quotations Log ({quotes.length})
                </h2>
              </div>
              <button
                onClick={handleLoadSampleQuotes}
                className="text-[10px] font-semibold text-[#315C4A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reload Sample Bids</span>
              </button>
            </div>

            {quotes.length === 0 ? (
              <div className="py-12 text-center text-[#5D756D] space-y-3">
                <FileText className="w-8 h-8 mx-auto text-[#5D756D]" />
                <div className="text-xs">No vendor quotes uploaded for this RFQ yet.</div>
                <button
                  onClick={handleLoadSampleQuotes}
                  className="px-4 py-2 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Load 3 Sample Vendor Quotes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((q) => {
                  const isWinner = q.isRecommendedWinner;
                  const isRisky = q.riskLevel === 'HIGH';
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border transition-colors space-y-2 ${
                        isWinner
                          ? 'border-[#315C4A] bg-[#EEF5F1]/50'
                          : isRisky
                          ? 'border-[#B6534A]/40 bg-[#FBF0EE]/50'
                          : 'border-[#E8DFD0] bg-[#F7F4EE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#202522]">{q.vendorName}</span>
                          {isWinner && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#315C4A] text-[#F7F4EE]">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#202522]">
                          {formatCurrency(q.quotedTotal, currency, false)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#5D756D]">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#5D756D]" />
                          <span>{q.fileName || 'Quotation.pdf'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#315C4A] font-semibold text-[10px]">
                            {q.extractionConfidence}% AI Confidence
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                            q.riskLevel === 'LOW'
                              ? 'bg-[#EEF5F1] text-[#4F7A5A] border-[#7A9B87]/30'
                              : 'bg-[#FBF0EE] text-[#B6534A] border-[#B6534A]/30'
                          }`}>
                            {q.riskLevel} RISK
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#202522] bg-[#FCFAF5] p-2 rounded-md border border-[#E8DFD0] flex items-center justify-between">
                        <span>Lead Time: <strong>{q.deliveryLeadTimeDays} Days</strong></span>
                        <span>Warranty: <strong>{q.warrantyPeriodMonths} Mo ({q.warrantyPeriodMonths / 12} Yrs)</strong></span>
                        <span>Incoterms: <strong>{q.incoterms}</strong></span>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => onNavigate('ai_analysis')}
                  className="w-full py-2.5 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Launch Deep AI Analysis & True Cost Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
