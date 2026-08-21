import React, { useState } from 'react';
import { 
  FileCode, 
  Sparkle, 
  ArrowRight, 
  Plus
} from 'lucide-react';
import { RFQ, ProcurementStage, VendorProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface RfqModuleProps {
  rfqs: RFQ[];
  activeRfq: RFQ;
  vendors: VendorProfile[];
  onSelectRfq: (rfq: RFQ) => void;
  onNavigate: (stage: ProcurementStage) => void;
  onCreateRfq: (rfq: RFQ) => void;
  currency: 'INR' | 'USD';
}

export const RfqModule: React.FC<RfqModuleProps> = ({
  rfqs,
  activeRfq,
  vendors,
  onSelectRfq,
  onNavigate,
  onCreateRfq,
  currency,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rfqTitle, setRfqTitle] = useState('100x Enterprise Laptops (i7, 16GB, 512GB SSD)');
  const [rfqCategory, setRfqCategory] = useState<'IT Hardware' | 'Industrial & Machinery' | 'Facility & Office' | 'Raw Materials' | 'Logistics & Services'>('IT Hardware');
  const [budgetAmount, setBudgetAmount] = useState(5000000);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>(['v-vendor-a', 'v-vendor-b', 'v-vendor-c']);
  const [deadline, setDeadline] = useState('2026-08-28');
  const [deliveryDate, setDeliveryDate] = useState('2026-09-02');
  const [specDescription, setSpecDescription] = useState('100 units with Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, Win 11 Pro, 3-year warranty SLA');

  const handleCreateNewRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const newRfq: RFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: rfqTitle,
      department: 'IT & Digital Engineering',
      requesterName: 'Procurement Lead',
      requesterEmail: 'lead@vendrax.ai',
      category: rfqCategory,
      priority: 'high',
      status: 'open_for_quotes',
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: deadline,
      targetBudget: budgetAmount,
      budgetCurrency: currency,
      deliveryLocation: 'VendraX Technology Hub, Whitefield, Bengaluru',
      requiredDeliveryDate: deliveryDate,
      description: specDescription,
      items: [
        {
          id: `item-${Date.now()}`,
          itemCode: 'LAP-i7-16-512',
          name: rfqTitle,
          category: rfqCategory,
          requiredQuantity: 100,
          unit: 'Units',
          targetUnitPrice: Math.round(budgetAmount / 100),
          technicalSpecs: { Specs: specDescription },
          complianceRequired: ['ISO 9001', 'RoHS', 'BIS Certified']
        }
      ],
      invitedVendorIds: selectedVendorIds,
      quotes: [],
      approvalStatus: 'pending',
      approvalRulesMatched: []
    };

    onCreateRfq(newRfq);
    setShowCreateModal(false);
  };

  return (
    <div id="rfq-module-container" className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#EEF5F1] text-[#315C4A] border border-[#7A9B87]/30">
              REQUEST FOR QUOTATION (RFQ)
            </span>
            <span className="text-xs text-[#5D756D] font-medium">B2B Vendor Solicitation</span>
          </div>
          <h1 className="text-2xl font-bold text-[#202522] tracking-tight">
            Active RFQ Packages & Multi-Vendor Broadcasts
          </h1>
          <p className="text-xs text-[#5D756D] max-w-2xl leading-relaxed">
            Manage electronic RFQs, dispatch standardized tender specifications to qualified vendors, and track inbound bid submissions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] font-semibold text-xs shadow-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create RFQ Package</span>
        </button>
      </div>

      {/* RFQ Catalog Table */}
      <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#E8DFD0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD0]">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#315C4A]" />
            <h2 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
              RFQ Pipeline ({rfqs.length})
            </h2>
          </div>
          <span className="text-[10px] text-[#5D756D] font-medium">Context: {activeRfq?.rfqNumber}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-[#5D756D] font-semibold text-[11px]">
                <th className="pb-3 pl-2">RFQ ID & Title</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Target Budget</th>
                <th className="pb-3">Vendors Invited</th>
                <th className="pb-3">Quote Deadline</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD0]/60">
              {rfqs.map((rfq) => {
                const isSelected = activeRfq?.id === rfq.id;
                return (
                  <tr
                    key={rfq.id}
                    className={`hover:bg-[#F7F4EE] transition-colors ${
                      isSelected ? 'bg-[#EEF5F1]/70 border-l-2 border-l-[#315C4A]' : ''
                    }`}
                  >
                    <td className="py-3.5 pl-2 max-w-xs">
                      <div className="text-xs font-bold text-[#315C4A]">{rfq.rfqNumber}</div>
                      <div className="text-[#202522] font-semibold truncate">{rfq.title}</div>
                      <div className="text-[10px] text-[#5D756D]">Created: {rfq.createdAt}</div>
                    </td>

                    <td className="py-3.5 text-[#202522] font-medium">
                      {rfq.items?.[0]?.requiredQuantity || 100} {rfq.items?.[0]?.unit || 'Units'}
                    </td>

                    <td className="py-3.5 font-bold text-[#315C4A]">
                      {formatCurrency(rfq.targetBudget, currency, false)}
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {rfq.invitedVendorIds.map((vId, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-[#F7F4EE] text-[#5D756D] text-[10px] border border-[#E8DFD0]"
                          >
                            {vId.replace('v-vendor-', 'Vendor ').replace('v-', '')}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 text-[#202522]">
                      {rfq.deadlineDate}
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                        rfq.status === 'decision_ready'
                          ? 'bg-[#EEF5F1] text-[#4F7A5A] border-[#7A9B87]/30'
                          : rfq.status === 'open_for_quotes'
                          ? 'bg-[#FCFAF5] text-[#315C4A] border-[#315C4A]/30'
                          : 'bg-[#F7F4EE] text-[#5D756D] border-[#E8DFD0]'
                      }`}>
                        {rfq.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            onSelectRfq(rfq);
                            onNavigate('quotations');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FCFAF5] hover:bg-[#E8DFD0]/40 text-[#202522] text-[11px] font-medium border border-[#E8DFD0] transition-colors cursor-pointer"
                        >
                          Upload Quotes
                        </button>
                        <button
                          onClick={() => {
                            onSelectRfq(rfq);
                            onNavigate('ai_analysis');
                          }}
                          className="px-3 py-1 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] text-[11px] font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Analyze</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate RFQ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#202522]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#FCFAF5] border border-[#E8DFD0] rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD0]">
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-[#B08A4A]" />
                <h3 className="text-sm font-bold text-[#202522] uppercase">Broadcast RFQ Tender</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#5D756D] hover:text-[#202522] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRfq} className="space-y-3 text-xs">
              <div>
                <label className="text-[#5D756D] font-medium block mb-1">RFQ Package Title</label>
                <input
                  type="text"
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E8DFD0] rounded-lg p-2 text-[#202522] font-semibold focus:outline-none focus:border-[#315C4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#5D756D] font-medium block mb-1">Target Budget ({currency})</label>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                    className="w-full bg-[#F7F4EE] border border-[#E8DFD0] rounded-lg p-2 text-[#315C4A] font-bold focus:outline-none focus:border-[#315C4A]"
                  />
                </div>

                <div>
                  <label className="text-[#5D756D] font-medium block mb-1">Category</label>
                  <select
                    value={rfqCategory}
                    onChange={(e) => setRfqCategory(e.target.value as any)}
                    className="w-full bg-[#F7F4EE] border border-[#E8DFD0] rounded-lg p-2 text-[#202522] font-medium focus:outline-none"
                  >
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Facility & Office">Facility & Office</option>
                    <option value="Industrial & Machinery">Industrial & Machinery</option>
                    <option value="Logistics & Services">Logistics & Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#5D756D] font-medium block mb-1">Technical Specifications</label>
                <textarea
                  value={specDescription}
                  onChange={(e) => setSpecDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-[#F7F4EE] border border-[#E8DFD0] rounded-lg p-2 text-[#202522] focus:outline-none focus:border-[#315C4A]"
                />
              </div>

              <div>
                <label className="text-[#5D756D] font-medium block mb-1">Invite Qualified Vendors</label>
                <div className="grid grid-cols-2 gap-2">
                  {vendors.map((v) => {
                    const isInvited = selectedVendorIds.includes(v.id);
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (isInvited) {
                            setSelectedVendorIds(selectedVendorIds.filter((id) => id !== v.id));
                          } else {
                            setSelectedVendorIds([...selectedVendorIds, v.id]);
                          }
                        }}
                        className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          isInvited
                            ? 'bg-[#EEF5F1] border-[#7A9B87] text-[#315C4A]'
                            : 'bg-[#F7F4EE] border-[#E8DFD0] text-[#5D756D]'
                        }`}
                      >
                        <span className="font-semibold truncate">{v.name}</span>
                        <span className="text-[10px]">{v.rating}★</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFD0]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#FCFAF5] text-[#202522] font-semibold border border-[#E8DFD0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#315C4A] hover:bg-[#264A3B] text-[#F7F4EE] font-semibold shadow-xs cursor-pointer"
                >
                  Broadcast RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
