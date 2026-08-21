import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { ProcurementStage, RFQ } from '../../types';
import { ThemeMode } from '../../utils/theme';

interface NavbarProps {
  currentStage: ProcurementStage;
  onNavigate: (stage: ProcurementStage) => void;
  activeRfq: RFQ;
  rfqs: RFQ[];
  onSelectRfq: (rfq: RFQ) => void;
  onOpenCopilot: () => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onNavigate,
  activeRfq,
  rfqs,
  onSelectRfq,
  onOpenCopilot,
  currency,
  onToggleCurrency,
  theme,
  onSetTheme,
  onOpenMobileMenu,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header 
      id="vendrax-navbar" 
      className="h-16 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-40 px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-xs transition-colors duration-150"
    >
      {/* Left: Hamburger (Mobile) + Brand Identity & Tagline */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg bg-[var(--background)] hover:bg-[var(--border)] text-[var(--foreground)] border border-[var(--border)] flex items-center justify-center transition-colors cursor-pointer touch-target"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-[var(--primary)]" />
        </button>

        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--primary)] text-[var(--surface)] flex items-center justify-center font-bold text-sm sm:text-base shadow-xs group-hover:opacity-90 transition-opacity shrink-0">
            <span>V</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-[var(--foreground)]">
                Vendra<span className="text-[var(--primary)]">X</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[var(--foreground-muted)] font-medium hidden md:block">
              Procurement & Financial Intelligence
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[var(--border)] hidden lg:block" />

        {/* Active RFQ Selector Switcher (Tablet & Desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">Context RFQ:</span>
          <div className="relative">
            <select
              value={activeRfq?.id || ''}
              onChange={(e) => {
                const selected = rfqs.find((r) => r.id === e.target.value);
                if (selected) onSelectRfq(selected);
              }}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg pl-2.5 pr-8 py-1 text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] cursor-pointer appearance-none max-w-xs truncate"
            >
              {rfqs.map((rfq) => (
                <option key={rfq.id} value={rfq.id} className="bg-[var(--surface)] text-[var(--foreground)]">
                  {rfq.rfqNumber} — {rfq.title.slice(0, 28)}...
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--foreground-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <button
          onClick={onToggleCurrency}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--border)]/40 transition-colors cursor-pointer"
          title="Toggle currency display (INR / USD)"
        >
          <span className={currency === 'INR' ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground-muted)]'}>₹ INR</span>
          <span className="text-[var(--border)]">|</span>
          <span className={currency === 'USD' ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground-muted)]'}>$ USD</span>
        </button>

        {/* Global Theme Toggle Button */}
        <div className="relative">
          <button
            onClick={() => {
              // Quick toggle between light -> dark -> system
              const next: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
              onSetTheme(next);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowThemeMenu(!showThemeMenu);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-medium text-[var(--foreground)] hover:bg-[var(--border)]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            title={`Current Theme: ${theme.toUpperCase()} (Click to cycle, right-click for menu)`}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-[var(--accent)]" />
            ) : theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[var(--primary)]" />
            ) : (
              <Monitor className="w-4 h-4 text-[var(--foreground-muted)]" />
            )}
            <span className="hidden sm:inline capitalize text-[11px] font-semibold text-[var(--foreground)]">
              {theme}
            </span>
          </button>
        </div>

        {/* Autonomous Engine Badge (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--primary-light)] border border-[var(--secondary)]/40 text-[var(--primary)] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
          <span className="text-[11px] font-semibold">Policy Guardrails Active</span>
        </div>

        {/* AI Copilot Trigger Button */}
        <button
          id="navbar-copilot-trigger"
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          title="Open AI Procurement Copilot"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Procurement Copilot</span>
          <span className="sm:hidden text-[11px]">AI</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[var(--border)]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[var(--primary-light)] border border-[var(--secondary)]/30 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
            PL
          </div>
          <div className="hidden 2xl:block text-left leading-tight">
            <div className="text-xs font-semibold text-[var(--foreground)]">Procurement Lead</div>
            <div className="text-[10px] text-[var(--foreground-muted)]">Enterprise Finance</div>
          </div>
        </div>
      </div>
    </header>
  );
};
