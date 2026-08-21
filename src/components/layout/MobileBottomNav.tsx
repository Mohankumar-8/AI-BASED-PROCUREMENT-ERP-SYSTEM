import React from 'react';
import { 
  LayoutDashboard, 
  FileCode, 
  FileSearch, 
  Users, 
  ShoppingBag, 
  Bot,
  Scale
} from 'lucide-react';
import { ProcurementStage } from '../../types';

interface MobileBottomNavProps {
  currentStage: ProcurementStage;
  onNavigate: (stage: ProcurementStage) => void;
  onOpenCopilot: () => void;
  quotesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentStage,
  onNavigate,
  onOpenCopilot,
  quotesCount,
}) => {
  const navTabs = [
    { id: 'dashboard' as ProcurementStage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rfqs' as ProcurementStage, label: 'RFQs', icon: FileCode },
    { id: 'quotations' as ProcurementStage, label: 'Quotes', icon: FileSearch, badge: quotesCount > 0 ? quotesCount : undefined },
    { id: 'ai_analysis' as ProcurementStage, label: 'Analysis', icon: Scale },
    { id: 'purchase_orders' as ProcurementStage, label: 'POs', icon: ShoppingBag },
    { id: 'vendor_intelligence' as ProcurementStage, label: 'Vendors', icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--border)] shadow-lg backdrop-blur-md px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all relative cursor-pointer ${
                isActive
                  ? 'text-[var(--primary)] font-bold'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[var(--primary)] text-[var(--surface)] text-[9px] font-bold px-1 rounded-full border border-[var(--surface)] min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* Floating Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[var(--primary)] font-bold cursor-pointer relative"
          aria-label="Open AI Copilot"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--surface)] flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 text-[var(--primary)]">Copilot</span>
        </button>
      </div>
    </div>
  );
};
