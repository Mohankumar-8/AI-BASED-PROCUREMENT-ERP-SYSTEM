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
  Settings
} from 'lucide-react';
import { ProcurementStage, RFQ } from '../../types';

interface SidebarProps {
  currentStage: ProcurementStage;
  onNavigate: (stage: ProcurementStage) => void;
  activeRfq: RFQ;
  quotesCount: number;
  anomaliesCount: number;
  onOpenCopilot?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStage,
  onNavigate,
  activeRfq,
  quotesCount,
  onOpenCopilot,
}) => {
  const mainNavItems = [
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
      badge: activeRfq?.items?.length ? `${activeRfq.items.length} items` : null,
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
      badgeColor: 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/40',
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
      badgeColor: 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--secondary)]/40',
    },
    {
      id: 'settings' as ProcurementStage,
      label: 'Settings',
      sublabel: 'Policies & Appearance',
      icon: Settings,
    },
  ];

  return (
    <aside
      id="vendrax-sidebar"
      className="w-60 lg:w-64 xl:w-72 bg-[var(--sidebar)] text-[var(--sidebar-text)] border-r border-[var(--sidebar-border)] flex-col justify-between p-3.5 hidden md:flex shrink-0 h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <div className="space-y-4">
        {/* Workflow Section Header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-[var(--sidebar-muted)] uppercase">
            Procurement Lifecycle
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--primary)]/30 text-[var(--sidebar-text)] border border-[var(--secondary)]/20">
            Enterprise
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentStage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'copilot' && onOpenCopilot) {
                    onOpenCopilot();
                  }
                  onNavigate(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors group cursor-pointer ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--sidebar-text)] font-semibold shadow-xs'
                    : 'text-[var(--sidebar-muted)] hover:text-[var(--sidebar-text)] hover:bg-[var(--sidebar-surface)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                      isActive
                        ? 'bg-[var(--primary-hover)] text-[var(--sidebar-text)]'
                        : 'bg-[var(--sidebar-surface)] text-[var(--sidebar-muted)] group-hover:text-[var(--sidebar-text)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-[var(--sidebar-text)] truncate">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-[var(--sidebar-muted)]/80 truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ml-1 shrink-0 ${
                      item.badgeColor || 'bg-[var(--sidebar-surface)] text-[var(--sidebar-muted)] border-[var(--secondary)]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Active RFQ Status Card */}
      <div className="pt-3 border-t border-[var(--sidebar-border)] space-y-2">
        <div className="p-3 rounded-lg bg-[var(--sidebar-surface)] border border-[var(--secondary)]/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--sidebar-muted)] uppercase font-semibold">
              Active Context
            </span>
            <span className="text-[10px] font-bold text-[var(--accent)]">
              {activeRfq?.rfqNumber || 'RFQ-2026-089'}
            </span>
          </div>
          <div className="text-xs font-semibold text-[var(--sidebar-text)] truncate">
            {activeRfq?.title || '100x Enterprise Laptops'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[var(--sidebar-muted)] pt-1 border-t border-[var(--sidebar-border)]">
            <span>Quotes Ingested</span>
            <span className="font-semibold text-[var(--sidebar-text)]">
              {activeRfq?.quotes?.length || 3} / 3
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
