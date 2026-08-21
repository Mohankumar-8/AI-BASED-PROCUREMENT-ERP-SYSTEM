import React, { useState } from 'react';
import { 
  Printer, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  X
} from 'lucide-react';
import { PurchaseOrder, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PurchaseOrdersModuleProps {
  pos: PurchaseOrder[];
  onNavigate: (stage: ProcurementStage) => void;
  currency: 'INR' | 'USD';
}

export const PurchaseOrdersModule: React.FC<PurchaseOrdersModuleProps> = ({
  pos,
  onNavigate,
  currency,
}) => {
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder>(pos[0] || null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <div id="purchase-orders-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              PURCHASE ORDERS & FULFILLMENT
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Official Contract Documents</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Purchase Orders & Electronic EDI Transmission
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Auto-generated enterprise purchase orders with legally binding SLAs, delivery tracking milestones, and automated ERP export.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)]/40 text-[var(--foreground)] font-semibold text-xs border border-[var(--border)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-target"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
            <span>Print PO</span>
          </button>
          <button
            onClick={() => onNavigate('inventory')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer touch-target"
          >
            <span>Inbound Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Layout: PO Master List (Left 4 cols) + Interactive PO Viewer (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: PO List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider px-1">
            Issued Purchase Orders ({pos.length})
          </div>

          <div className="space-y-2.5">
            {pos.map((po) => {
              const isSelected = selectedPo?.id === po.id;
              return (
                <div
                  key={po.id}
                  onClick={() => setSelectedPo(po)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors space-y-2 touch-target ${
                    isSelected
                      ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] shadow-xs'
                      : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--primary)]">{po.poNumber}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-semibold ${
                      po.status === 'completed'
                        ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                        : 'bg-[var(--background)] text-[var(--primary)] border-[var(--primary)]/30'
                    }`}>
                      {po.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[var(--foreground)] truncate">{po.vendorName}</div>
                    <div className="text-[11px] text-[var(--foreground-muted)] truncate">{po.items}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[var(--border)]">
                    <span className="font-bold text-[var(--foreground)]">{formatCurrency(po.totalAmount, currency, false)}</span>
                    <span className="text-[var(--foreground-muted)] text-[10px]">Due: {po.deliveryDueDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Full Professional PO Viewer */}
        <div className="lg:col-span-8">
          {selectedPo ? (
            <div className="p-5 sm:p-7 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5 sm:space-y-6 shadow-xs">
              {/* PO Header Paper */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[var(--border)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[var(--foreground)] tracking-tight">
                      Vendra<span className="text-[var(--primary)]">X</span> Enterprise
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--background)] text-[var(--foreground-muted)] border border-[var(--border)]">
                      OFFICIAL PO
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--foreground-muted)]">
                    VendraX Technology Hub, Whitefield, Bengaluru, Karnataka 560066
                  </p>
                  <p className="text-[11px] text-[var(--foreground-muted)]">
                    GSTIN: 29AAACV1234F1Z8 | PAN: AAACV1234F
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-0.5">
                  <div className="text-sm font-bold text-[var(--primary)]">
                    {selectedPo.poNumber}
                  </div>
                  <div className="text-[11px] text-[var(--foreground-muted)]">Issue Date: {selectedPo.issueDate}</div>
                  <div className="text-[11px] text-[var(--foreground-muted)]">Delivery Due: {selectedPo.deliveryDueDate}</div>
                </div>
              </div>

              {/* Vendor & Shipping Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">
                    Vendor (Supplier)
                  </span>
                  <div className="font-bold text-[var(--foreground)] text-sm">{selectedPo.vendorName}</div>
                  <div className="text-[var(--foreground-muted)] text-[11px]">Payment Terms: {selectedPo.paymentTerms}</div>
                  <div className="text-[var(--foreground-muted)] text-[11px]">Incoterms: {selectedPo.incoterms}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">
                    Ship-To Delivery Destination
                  </span>
                  <div className="font-bold text-[var(--foreground)] text-sm">Bengaluru Central Warehouse Hub</div>
                  <div className="text-[var(--foreground-muted)] text-[11px]">{selectedPo.deliveryAddress}</div>
                  <div className="text-[var(--foreground-muted)] text-[11px]">Warranty: {selectedPo.warrantyTerms}</div>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">
                  Purchased Line Items
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)] font-semibold text-[11px]">
                        <th className="pb-2 pl-2">Item Description</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Unit Price</th>
                        <th className="pb-2 text-right pr-2">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {selectedPo.lineItems && selectedPo.lineItems.length > 0 ? (
                        selectedPo.lineItems.map((li) => (
                          <tr key={li.id}>
                            <td className="py-2.5 pl-2">
                              <div className="font-bold text-[var(--foreground)]">{li.description}</div>
                              <div className="text-[10px] text-[var(--foreground-muted)]">SKU: {li.itemCode} • {li.warrantyMonths} Mo Warranty</div>
                            </td>
                            <td className="py-2.5 text-center text-[var(--foreground)] font-medium">{li.quantity} {li.unit}</td>
                            <td className="py-2.5 text-right text-[var(--foreground-muted)]">{formatCurrency(li.unitPrice, currency, false)}</td>
                            <td className="py-2.5 text-right pr-2 font-bold text-[var(--foreground)]">{formatCurrency(li.totalPrice, currency, false)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-2.5 pl-2 font-bold text-[var(--foreground)]">{selectedPo.items}</td>
                          <td className="py-2.5 text-center text-[var(--foreground)] font-medium">{selectedPo.quantity}</td>
                          <td className="py-2.5 text-right text-[var(--foreground-muted)]">{formatCurrency(selectedPo.unitPrice, currency, false)}</td>
                          <td className="py-2.5 text-right pr-2 font-bold text-[var(--foreground)]">{formatCurrency(selectedPo.totalAmount, currency, false)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-end pt-3 border-t border-[var(--border)]">
                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[var(--foreground-muted)]">
                    <span>Subtotal:</span>
                    <span className="text-[var(--foreground)]">{formatCurrency(selectedPo.totalAmount, currency, false)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground-muted)]">
                    <span>Taxes / DDP:</span>
                    <span className="text-[var(--foreground)]">{formatCurrency(selectedPo.taxAmount, currency, false)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[var(--foreground)] pt-1.5 border-t border-[var(--border)]">
                    <span>Total PO Value:</span>
                    <span className="text-[var(--primary)]">{formatCurrency(selectedPo.totalAmount, currency, false)}</span>
                  </div>
                </div>
              </div>

              {/* Fulfillment Milestones Tracker */}
              <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider">
                    Fulfillment Milestones Tracker
                  </span>
                  <span className="text-[10px] text-[var(--primary)] font-semibold">Automated Logistics Sync</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {selectedPo.milestones?.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-center space-y-1 ${
                        m.completed
                          ? 'bg-[var(--primary-light)] border-[var(--secondary)]/40 text-[var(--primary)]'
                          : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                        )}
                        <span className="font-semibold text-[11px]">{m.completed ? 'COMPLETED' : 'PENDING'}</span>
                      </div>
                      <div className="text-[10px] leading-tight font-medium text-[var(--foreground)]">{m.title}</div>
                      <div className="text-[9px] text-[var(--foreground-muted)]">{m.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center text-[var(--foreground-muted)]">
              Select a purchase order to inspect document preview.
            </div>
          )}
        </div>
      </div>

      {/* Print Document Modal */}
      {isPrintModalOpen && selectedPo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">VENDRAX ENTERPRISE PURCHASE ORDER</h2>
                <p className="text-xs text-[var(--foreground-muted)]">PO Ref: {selectedPo.poNumber}</p>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center justify-center text-sm transition-colors cursor-pointer touch-target"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Supplier:</strong> {selectedPo.vendorName}<br />
                <strong>Terms:</strong> {selectedPo.paymentTerms}<br />
                <strong>Incoterms:</strong> {selectedPo.incoterms}
              </div>
              <div className="sm:text-right">
                <strong>Issue Date:</strong> {selectedPo.issueDate}<br />
                <strong>Due Date:</strong> {selectedPo.deliveryDueDate}<br />
                <strong>Total Amount:</strong> {formatCurrency(selectedPo.totalAmount, currency, false)}
              </div>
            </div>

            <div className="p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs">
              Item: {selectedPo.items} (Qty: {selectedPo.quantity}) - Total: {formatCurrency(selectedPo.totalAmount, currency, false)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground)] text-xs font-semibold border border-[var(--border)] cursor-pointer touch-target text-center"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsPrintModalOpen(false);
                }}
                className="px-5 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer touch-target"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Confirm & Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
