import React, { useState } from 'react';
import { 
  Boxes, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  RefreshCw, 
  Truck
} from 'lucide-react';
import { InventoryItem, InventoryMovement, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  onTriggerReorder: (item: InventoryItem) => void;
  onNavigate: (stage: ProcurementStage) => void;
  currency: 'INR' | 'USD';
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  movements,
  onTriggerReorder,
  onNavigate,
  currency,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredItems = inventory.filter((item) => 
    filterCategory === 'ALL' || item.category === filterCategory
  );

  return (
    <div id="inventory-module-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30">
              INVENTORY & REORDER AUTOMATION
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Warehouse Sync</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Warehouse Stock Levels & Inbound Purchase Receipts
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Real-time stock monitoring with autonomous buffer threshold reorder triggers, incoming PO tracking, and immutable stock ledger history.
          </p>
        </div>

        <button
          onClick={() => onNavigate('purchase_requests')}
          className="px-4 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer touch-target"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Request</span>
        </button>
      </div>

      {/* 4 Inventory Status KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Total Stock Items</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)]">4 SKUs</div>
          <div className="text-[10px] text-[var(--foreground-muted)] truncate">Central Hub Bangalore</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Incoming Stock</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--primary)]">600 Units</div>
          <div className="text-[10px] text-[var(--primary)] truncate">PO-2026-089 (100 Laptops)</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Reorder Alerts</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--danger)]">2 Items</div>
          <div className="text-[10px] text-[var(--danger)] truncate">Laptops & Desks Low</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <span className="text-[11px] text-[var(--foreground-muted)] font-semibold">Total Inventory Value</span>
          <div className="text-lg sm:text-xl font-bold text-[var(--success)] truncate">
            {formatCurrency(8062000, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--foreground-muted)]">Asset Baseline</div>
        </div>
      </div>

      {/* Inventory Items Section */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Warehouse SKU Stock Matrix
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)] focus:outline-none touch-target"
            >
              <option value="ALL">All Categories</option>
              <option value="IT Hardware">IT Hardware</option>
              <option value="Facility & Office">Facility & Office</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)] font-semibold text-[11px]">
                <th className="pb-3 pl-3">Item & SKU</th>
                <th className="pb-3 text-center">Current Stock</th>
                <th className="pb-3 text-center">Incoming Stock</th>
                <th className="pb-3 text-center">Reorder Level</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Unit Cost</th>
                <th className="pb-3 text-right pr-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--background)]/60 transition-colors">
                  <td className="py-3.5 pl-3">
                    <div className="font-bold text-[var(--foreground)] text-xs">{item.name}</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">
                      SKU: {item.sku} • {item.warehouseLocation}
                    </div>
                  </td>

                  <td className="py-3.5 text-center font-bold text-sm text-[var(--foreground)]">
                    {item.currentStock} {item.unit}
                  </td>

                  <td className="py-3.5 text-center font-bold text-[var(--primary)]">
                    +{item.incomingStock} {item.unit}
                  </td>

                  <td className="py-3.5 text-center text-[var(--foreground-muted)]">
                    {item.reorderLevel} {item.unit}
                  </td>

                  <td className="py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.status === 'optimal'
                        ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                        : item.status === 'low_stock'
                        ? 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/30'
                        : 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30'
                    }`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 text-right text-[var(--foreground-muted)]">
                    {formatCurrency(item.unitCost, currency, false)}
                  </td>

                  <td className="py-3.5 text-right pr-3">
                    {item.status !== 'optimal' ? (
                      <button
                        onClick={() => onTriggerReorder(item)}
                        className="px-3 py-1 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--surface)] font-semibold text-[11px] shadow-xs flex items-center gap-1 ml-auto cursor-pointer touch-target"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Auto-Reorder</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[var(--success)] font-medium">Optimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-[var(--foreground)]">{item.name}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">
                    SKU: {item.sku} • {item.warehouseLocation}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  item.status === 'optimal'
                    ? 'bg-[var(--primary-light)] text-[var(--success)] border-[var(--secondary)]/30'
                    : item.status === 'low_stock'
                    ? 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/30'
                    : 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]/30'
                }`}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-[var(--border)]">
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Current</span>
                  <span className="font-bold text-[var(--foreground)]">{item.currentStock} {item.unit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Incoming</span>
                  <span className="font-bold text-[var(--primary)]">+{item.incomingStock} {item.unit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Reorder At</span>
                  <span className="text-[var(--foreground-muted)]">{item.reorderLevel} {item.unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[var(--foreground-muted)]">Unit: {formatCurrency(item.unitCost, currency, false)}</span>
                {item.status !== 'optimal' && (
                  <button
                    onClick={() => onTriggerReorder(item)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--surface)] font-semibold text-xs flex items-center gap-1 cursor-pointer touch-target"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Reorder</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inventory Movements Ledger */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Recent Inventory Stock Movements
            </h2>
          </div>
          <span className="text-[10px] text-[var(--foreground-muted)]">Warehouse Ledger</span>
        </div>

        <div className="space-y-2">
          {movements.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-between text-xs gap-2"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.quantity > 0
                    ? 'bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30'
                    : 'bg-[var(--background)] text-[var(--foreground-muted)] border border-[var(--border)]'
                }`}>
                  {m.quantity > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[var(--foreground)] truncate">{m.itemName}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)] truncate">
                    {m.type} • {m.warehouseLocation} • by {m.actor}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`font-bold ${m.quantity > 0 ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
                </div>
                <div className="text-[10px] text-[var(--foreground-muted)]">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
