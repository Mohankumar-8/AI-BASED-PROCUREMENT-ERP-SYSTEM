import React, { useState } from 'react';
import { 
  FileText, 
  Sparkle, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { PurchaseRequest, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PurchaseRequestsModuleProps {
  requests: PurchaseRequest[];
  onCreatePr: (pr: PurchaseRequest) => void;
  onConvertToRfq: (pr: PurchaseRequest) => void;
  currency: 'INR' | 'USD';
}

export const PurchaseRequestsModule: React.FC<PurchaseRequestsModuleProps> = ({
  requests,
  onCreatePr,
  onConvertToRfq,
  currency,
}) => {
  // Form State
  const [naturalInput, setNaturalInput] = useState(
    'We need 100 laptops with i7, 16GB RAM and 512GB SSD under ₹50,000 per unit within 10 days.'
  );
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiParsedSuccess, setAiParsedSuccess] = useState(false);

  // Structured Form Fields
  const [product, setProduct] = useState('Enterprise High-Performance Laptops');
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('Units');
  const [specifications, setSpecifications] = useState('Intel Core i7 13th Gen, 16GB DDR5, 512GB NVMe SSD, 14" FHD IPS, TPM 2.0, Win 11 Pro');
  const [budget, setBudget] = useState(5000000); // ₹50,00,000
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('2026-09-02');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');
  const [department, setDepartment] = useState('IT & Digital Engineering');

  // One-click presets
  const samplePresets = [
    {
      label: '100x Laptops (i7 / 16GB / ₹50k)',
      text: 'We need 100 laptops with i7, 16GB RAM and 512GB SSD under ₹50,000 per unit within 10 days.',
    },
    {
      label: '500x Wi-Fi 7 Access Points',
      text: 'Procure 500 enterprise Tri-Band Wi-Fi 7 access points with 2.5GbE PoE+ and 36-month warranty under ₹30,000 per unit for Bangalore campus by Sept 15.',
    },
    {
      label: '150x Ergonomic Desks',
      text: 'Requesting 150 dual-motor electric sit-stand desks with anti-collision sensors, max budget ₹40,000 each, delivery in 3 weeks.',
    },
  ];

  // AI Understand Requirement Handler
  const handleAiUnderstandRequirement = async () => {
    if (!naturalInput.trim()) return;
    setIsAiParsing(true);
    setAiParsedSuccess(false);

    try {
      const response = await fetch('/api/ai/parse-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawRequestText: naturalInput,
          department: department,
          targetBudget: budget,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          const d = result.data;
          if (d.items && d.items[0]) {
            setProduct(d.items[0].name || product);
            setQuantity(d.items[0].requiredQuantity || quantity);
            setUnit(d.items[0].unit || 'Units');
            if (d.items[0].technicalSpecs) {
              const specStr = Object.entries(d.items[0].technicalSpecs)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ');
              setSpecifications(specStr);
            }
          }
          if (d.estimatedBudgetUSD || d.estimatedBudget) {
            setBudget(d.estimatedBudget || (d.estimatedBudgetUSD ? d.estimatedBudgetUSD * 83 : budget));
          }
          if (d.priority) {
            const capPriority = d.priority.charAt(0).toUpperCase() + d.priority.slice(1);
            if (['Urgent', 'High', 'Medium', 'Low'].includes(capPriority)) {
              setPriority(capPriority as any);
            }
          }
          setAiParsedSuccess(true);
        }
      } else {
        runLocalHeuristicParse(naturalInput);
      }
    } catch {
      runLocalHeuristicParse(naturalInput);
    } finally {
      setIsAiParsing(false);
    }
  };

  const runLocalHeuristicParse = (text: string) => {
    if (text.toLowerCase().includes('laptop')) {
      setProduct('Enterprise High-Performance Laptops');
      setQuantity(100);
      setSpecifications('Intel Core i7 13th Gen, 16GB DDR5 RAM, 512GB NVMe SSD, 14" FHD IPS, TPM 2.0, Windows 11 Pro OEM');
      setBudget(5000000);
      setPriority('High');
      setRequiredDeliveryDate('2026-09-02');
    } else if (text.toLowerCase().includes('wi-fi') || text.toLowerCase().includes('access point')) {
      setProduct('Enterprise Wi-Fi 7 Access Points');
      setQuantity(500);
      setSpecifications('IEEE 802.11be Tri-Band 4x4 MU-MIMO, 2x 2.5GbE PoE+, Zero-Trust Cloud Management, 36 Mo Warranty');
      setBudget(15000000);
      setPriority('Urgent');
      setRequiredDeliveryDate('2026-09-15');
    } else if (text.toLowerCase().includes('desk') || text.toLowerCase().includes('ergonomic')) {
      setProduct('Dual-Motor Ergonomic Sit-Stand Desks');
      setQuantity(150);
      setSpecifications('Dual Motor <45dB, 125kg load, 62-128cm height range, 4 presets, anti-collision sensor, FSC wood');
      setBudget(6000000);
      setPriority('Medium');
      setRequiredDeliveryDate('2026-09-20');
    }
    setAiParsedSuccess(true);
  };

  // Submit PR Handler
  const handleSubmitPr = (e: React.FormEvent) => {
    e.preventDefault();
    const newPr: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      prNumber: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `${quantity}x ${product}`,
      product,
      quantity,
      unit,
      specifications: { 'Technical Specs': specifications },
      specificationsText: specifications,
      budget,
      currency: currency,
      requiredDeliveryDate,
      priority,
      department,
      requesterName: 'Procurement Lead',
      requesterEmail: 'procurement@vendrax.ai',
      status: 'Approved',
      createdDate: new Date().toISOString().split('T')[0],
      rawNaturalLanguage: naturalInput,
    };

    onCreatePr(newPr);
  };

  return (
    <div id="purchase-requests-container" className="space-y-6 pb-12">
      {/* Title Banner */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              PURCHASE REQUESTS
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Requirement Parser</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Purchase Requests & Requirement Ingestion
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Input business procurement requests in natural language. VendraX automatically structures line items, quantities, technical specifications, and budgetary caps.
          </p>
        </div>
      </div>

      {/* Main Grid: AI Requirement Generator & PR List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: AI Natural Language Creator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  AI Natural Language Ingestion
                </h2>
              </div>
              <span className="text-[10px] text-[var(--primary)] font-semibold">Structured Parsing</span>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[var(--foreground-muted)] block">
                One-Click Requirement Presets:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {samplePresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNaturalInput(p.text);
                      runLocalHeuristicParse(p.text);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[11px] font-medium text-[var(--foreground)] border border-[var(--border)] transition-colors cursor-pointer touch-target"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[var(--foreground)] block">
                Natural Language Requirement:
              </label>
              <textarea
                value={naturalInput}
                onChange={(e) => setNaturalInput(e.target.value)}
                rows={3}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] leading-relaxed"
                placeholder="e.g. We need 100 laptops with i7, 16GB RAM and 512GB SSD under ₹50,000 per unit within 10 days."
              />
            </div>

            {/* AI Understand Requirement Button */}
            <button
              type="button"
              onClick={handleAiUnderstandRequirement}
              disabled={isAiParsing}
              className="w-full py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer touch-target"
            >
              {isAiParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Specifications with AI...</span>
                </>
              ) : (
                <>
                  <Sparkle className="w-4 h-4 text-[var(--accent)]" />
                  <span>Parse Requirement with AI</span>
                </>
              )}
            </button>

            {aiParsedSuccess && (
              <div className="p-2.5 rounded-lg bg-[var(--primary-light)] border border-[var(--secondary)]/40 flex items-center gap-2 text-[var(--primary)] text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                <span>Successfully synthesized requirement into structured procurement fields.</span>
              </div>
            )}

            {/* Structured Form Formatted */}
            <form onSubmit={handleSubmitPr} className="space-y-3 pt-3 border-t border-[var(--border)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[var(--foreground-muted)] font-medium block mb-1">Product</label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--foreground-muted)] font-medium block mb-1">Quantity & Unit</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-2/3 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-1/3 bg-[var(--background)] border border-[var(--border)] rounded-lg px-2 py-2 text-xs text-[var(--foreground-muted)] text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[var(--foreground-muted)] font-medium block mb-1">Specifications</label>
                <textarea
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  rows={2}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-[var(--foreground-muted)] font-medium block mb-1">Budget ({currency})</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--primary)] font-bold focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--foreground-muted)] font-medium block mb-1">Required Delivery</label>
                  <input
                    type="date"
                    value={requiredDeliveryDate}
                    onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-2 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--foreground-muted)] font-medium block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-2 py-2 text-xs text-[var(--foreground)] font-semibold focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)]/40 text-[var(--foreground)] font-semibold text-xs border border-[var(--border)] transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer touch-target"
              >
                <Plus className="w-4 h-4 text-[var(--primary)]" />
                <span>Save Purchase Request</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 6 Cols: Active PR List Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Purchase Requests Log ({requests.length})
                </h2>
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)] font-medium">Direct RFQ Dispatch</span>
            </div>

            <div className="space-y-3">
              {requests.map((pr) => (
                <div
                  key={pr.id}
                  className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3 hover:border-[var(--primary)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--primary)]">{pr.prNumber}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${
                        pr.priority === 'Urgent' || pr.priority === 'High'
                          ? 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30'
                          : 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--secondary)]/30'
                      }`}>
                        {pr.priority.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--foreground-muted)] border border-[var(--border)]">
                      {pr.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-[var(--foreground)]">{pr.title}</h3>
                    <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 line-clamp-2">{pr.specificationsText}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[10px] block">Target Budget</span>
                        <span className="font-bold text-[var(--primary)]">{formatCurrency(pr.budget, currency, false)}</span>
                      </div>

                      <div>
                        <span className="text-[var(--foreground-muted)] text-[10px] block">Required Date</span>
                        <span className="text-[var(--foreground)] font-medium">{pr.requiredDeliveryDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onConvertToRfq(pr)}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-semibold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer touch-target"
                    >
                      <span>Generate RFQ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
