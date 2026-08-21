import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FileCode, 
  FileSearch, 
  Scale, 
  Users, 
  ShoppingBag, 
  Boxes, 
  Receipt, 
  Bot, 
  Settings,
  X,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ProcurementStage, RFQ } from '../../types';
import { ThemeMode } from '../../utils/theme';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: ProcurementStage;
  onNavigate: (stage: ProcurementStage) => void;
  activeRfq: RFQ;
  rfqs: RFQ[];
  onSelectRfq: (rfq: RFQ) => void;
  quotesCount: number;
  onOpenCopilot: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentStage,
  onNavigate,
  activeRfq,
  rfqs,
  onSelectRfq,
  quotesCount,
  onOpenCopilot,
  theme,
  onSetTheme,
  currency,
  onToggleCurrency,
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'dashboard' as ProcurementStage,
      label: '1. Dashboard',
      sublabel: 'Procurement KPIs & Metrics',
      icon: LayoutDashboard,
    },
    {
      id: 'purchase_requests' as ProcurementStage,
      label: '2. Purchase Requests',
      sublabel: 'Requirement Parser & Intake',
      icon: FileText,
      badge: 'PRs',
    },
    {
      id: 'rfqs' as ProcurementStage,
      label: '3. RFQs',
      sublabel: 'Tenders & Vendor Broadcast',
      icon: FileCode,
      badge: activeRfq?.items?.length ? `${activeRfq.items.length} items` : undefined,
    },
    {
      id: 'quotations' as ProcurementStage,
      label: '4. Quotations',
      sublabel: 'Document Ingestion & OCR',
      icon: FileSearch,
      badge: quotesCount > 0 ? `${quotesCount} quotes` : '0',
    },
    {
      id: 'ai_analysis' as ProcurementStage,
      label: '5. AI Analysis',
      sublabel: 'True Cost & Vendor Radar',
      icon: Scale,
      badge: 'Core',
    },
    {
      id: 'vendor_intelligence' as ProcurementStage,
      label: '6. Vendor Intelligence',
      sublabel: 'Vendor Risk & Performance',
      icon: Users,
    },
    {
      id: 'purchase_orders' as ProcurementStage,
      label: '7. Purchase Orders',
      sublabel: 'PO Issuance & Milestones',
      icon: ShoppingBag,
    },
    {
      id: 'inventory' as ProcurementStage,
      label: '8. Inventory',
      sublabel: 'Stock Levels & Reorders',
      icon: Boxes,
    },
    {
      id: 'finance' as ProcurementStage,
      label: '9. Finance',
      sublabel: '3-Way Invoice Matching',
      icon: Receipt,
    },
    {
      id: 'copilot' as ProcurementStage,
      label: '10. AI Copilot',
      sublabel: 'Procurement Assistant',
      icon: Bot,
      badge: 'Interactive',
    },
    {
      id: 'settings' as ProcurementStage,
      label: 'Settings',
      sublabel: 'Policies, Themes & Governance',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-[85vw] max-w-xs bg-[#202522] dark:bg-[#131614] text-[#F7F4EE] h-full flex flex-col justify-between shadow-2xl border-r border-[#315C4A]/30 z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#315C4A]/30 flex items-center justify-between bg-[#1A1E1B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#315C4A] text-[#F7F4EE] flex items-center justify-center font-bold text-sm shadow-xs">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#F7F4EE]">VendraX</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[#315C4A]/40 text-[#7A9B87] border border-[#7A9B87]/30">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-[#BFC8C1]">Procurement Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#272D29] hover:bg-[#315C4A] text-[#BFC8C1] hover:text-[#F7F4EE] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Context RFQ Selector */}
          <div className="p-2.5 rounded-lg bg-[#272D29] border border-[#315C4A]/30 space-y-1.5">
            <span className="text-[10px] text-[#BFC8C1] uppercase font-semibold block">
              Active Tender Context
            </span>
            <select
              value={activeRfq?.id || ''}
              onChange={(e) => {
                const selected = rfqs.find((r) => r.id === e.target.value);
                if (selected) {
                  onSelectRfq(selected);
                }
              }}
              className="w-full bg-[#1A1E1B] border border-[#315C4A]/40 rounded-md p-1.5 text-xs text-[#F7F4EE] focus:outline-none"
            >
              {rfqs.map((rfq) => (
                <option key={rfq.id} value={rfq.id}>
                  {rfq.rfqNumber} — {rfq.title.slice(0, 22)}...
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentStage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'copilot') {
                      onOpenCopilot();
                    } else {
                      onNavigate(item.id);
                    }
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer touch-target ${
                    isActive
                      ? 'bg-[#315C4A] text-[#F7F4EE] font-bold shadow-xs'
                      : 'text-[#BFC8C1] hover:text-[#F7F4EE] hover:bg-[#272D29]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 text-[#7A9B87]" />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate text-[#F7F4EE]">{item.label}</div>
                      <div className="text-[10px] text-[#BFC8C1]/70 truncate">{item.sublabel}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1A1E1B] text-[#7A9B87] border border-[#7A9B87]/30">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-[#BFC8C1]/50" />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer: Quick Theme & Currency Controls */}
        <div className="p-3 border-t border-[#315C4A]/30 bg-[#1A1E1B] space-y-3">
          {/* Theme Selector */}
          <div>
            <span className="text-[10px] text-[#BFC8C1] uppercase font-semibold block mb-1.5">
              Theme Mode
            </span>
            <div className="grid grid-cols-3 gap-1 bg-[#272D29] p-1 rounded-lg border border-[#315C4A]/30">
              <button
                onClick={() => onSetTheme('light')}
                className={`py-1.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#315C4A] text-[#F7F4EE]'
                    : 'text-[#BFC8C1] hover:text-[#F7F4EE]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => onSetTheme('dark')}
                className={`py-1.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#315C4A] text-[#F7F4EE]'
                    : 'text-[#BFC8C1] hover:text-[#F7F4EE]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => onSetTheme('system')}
                className={`py-1.5 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  theme === 'system'
                    ? 'bg-[#315C4A] text-[#F7F4EE]'
                    : 'text-[#BFC8C1] hover:text-[#F7F4EE]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#BFC8C1]">Currency:</span>
            <button
              onClick={onToggleCurrency}
              className="px-2.5 py-1 rounded bg-[#272D29] border border-[#315C4A]/40 text-xs font-bold text-[#F7F4EE] hover:bg-[#315C4A]/50 transition-colors cursor-pointer"
            >
              {currency === 'INR' ? '₹ INR (Lakhs)' : '$ USD (Thousands)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
