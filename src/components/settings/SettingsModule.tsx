import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  Sun,
  Moon,
  Monitor,
  Palette,
  Bell
} from 'lucide-react';
import { EnterpriseSettings } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ThemeMode } from '../../utils/theme';

interface SettingsModuleProps {
  settings: EnterpriseSettings;
  onUpdateSettings: (settings: EnterpriseSettings) => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  currency,
  onToggleCurrency,
  theme,
  onSetTheme,
}) => {
  const [localSettings, setLocalSettings] = useState<EnterpriseSettings>(settings);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  return (
    <div id="settings-module-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              ENTERPRISE GOVERNANCE & APPEARANCE
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Policy Guardrails & UI Theme</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Procurement Policy Settings & Theme Configuration
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Configure automated approval thresholds, multi-factor vendor scoring floors, Incoterms risk triggers, and appearance preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer touch-target"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveFeedback && (
        <div className="p-3 rounded-lg bg-[var(--success-light)] border border-[var(--success)]/40 text-[var(--success)] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Enterprise procurement policies and appearance settings updated successfully!</span>
        </div>
      )}

      {/* 1. Theme Configuration & Appearance Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Appearance & Theme Configuration
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] font-semibold border border-[var(--secondary)]/30">
            Active: {theme.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Light Mode Option */}
          <div
            onClick={() => onSetTheme('light')}
            className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
              theme === 'light'
                ? 'bg-[#FCFAF5] border-[#315C4A] shadow-xs ring-2 ring-[#315C4A]/20'
                : 'bg-[#F7F4EE] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#B08A4A]" />
                <span className="font-bold text-xs text-[#202522]">Light Theme</span>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#315C4A]" />}
            </div>
            <p className="text-[11px] text-[#5D756D] leading-snug">
              Warm neutral ivory canvas (<span className="font-mono text-[10px]">#F7F4EE</span>) paired with forest green and slate tones for optimal readability.
            </p>
            <div className="flex gap-1.5 pt-1">
              <span className="w-4 h-4 rounded-full bg-[#F7F4EE] border border-[#E8DFD0]" title="Background #F7F4EE" />
              <span className="w-4 h-4 rounded-full bg-[#FCFAF5] border border-[#E8DFD0]" title="Surface #FCFAF5" />
              <span className="w-4 h-4 rounded-full bg-[#315C4A]" title="Primary #315C4A" />
              <span className="w-4 h-4 rounded-full bg-[#B08A4A]" title="Accent #B08A4A" />
            </div>
          </div>

          {/* Dark Mode Option */}
          <div
            onClick={() => onSetTheme('dark')}
            className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
              theme === 'dark'
                ? 'bg-[#202522] border-[#6F9A82] shadow-xs ring-2 ring-[#6F9A82]/20'
                : 'bg-[#1D221F] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#6F9A82]" />
                <span className="font-bold text-xs text-[#F3F0E8]">Dark Theme</span>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#6F9A82]" />}
            </div>
            <p className="text-[11px] text-[#BFC7C0] leading-snug">
              Deep charcoal canvas (<span className="font-mono text-[10px]">#171A18</span>) with warm elevated surfaces for comfortable prolonged enterprise usage.
            </p>
            <div className="flex gap-1.5 pt-1">
              <span className="w-4 h-4 rounded-full bg-[#171A18] border border-[#343B36]" title="Background #171A18" />
              <span className="w-4 h-4 rounded-full bg-[#202522] border border-[#343B36]" title="Surface #202522" />
              <span className="w-4 h-4 rounded-full bg-[#6F9A82]" title="Primary #6F9A82" />
              <span className="w-4 h-4 rounded-full bg-[#C5A35C]" title="Accent #C5A35C" />
            </div>
          </div>

          {/* System Option */}
          <div
            onClick={() => onSetTheme('system')}
            className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
              theme === 'system'
                ? 'bg-[var(--surface)] border-[var(--primary)] shadow-xs ring-2 ring-[var(--primary)]/20'
                : 'bg-[var(--background)] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[var(--primary)]" />
                <span className="font-bold text-xs text-[var(--foreground)]">System Auto</span>
              </div>
              {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)] leading-snug">
              Automatically syncs with your operating system preference (<span className="font-mono text-[10px]">prefers-color-scheme</span>) in real-time.
            </p>
            <div className="text-[10px] text-[var(--primary)] font-medium pt-1">
              • Dynamic Real-time Listener Active
            </div>
          </div>
        </div>
      </div>

      {/* 2. Enterprise Policy Guardrails & Settings */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Zero-Touch Auto-Approval Engine */}
        <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Zero-Touch Auto-Approval Policies
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[var(--foreground)] font-semibold block mb-1">
                Auto-Approval Budget Threshold ({currency})
              </label>
              <input
                type="number"
                value={localSettings.autoApprovalThreshold}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoApprovalThreshold: Number(e.target.value) })
                }
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-[var(--foreground)] font-bold focus:outline-none focus:border-[var(--primary)]"
              />
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                RFQs with True Landed Cost ≤ {formatCurrency(localSettings.autoApprovalThreshold, currency, false)} can be auto-approved without manual escalation.
              </p>
            </div>

            <div>
              <label className="text-[var(--foreground)] font-semibold block mb-1">
                Minimum AI Vendor Score for Auto-Approval (0-100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={localSettings.minVendorScoreForAutoApproval}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    minVendorScoreForAutoApproval: Number(e.target.value),
                  })
                }
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-[var(--primary)] font-bold focus:outline-none focus:border-[var(--primary)]"
              />
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                Vendors must score at or above {localSettings.minVendorScoreForAutoApproval}/100 to qualify for instant PO issuance.
              </p>
            </div>

            <div>
              <label className="text-[var(--foreground)] font-semibold block mb-1">
                Maximum Risk Tier Allowed for Auto-Approval
              </label>
              <select
                value={localSettings.maxRiskAllowedForAutoApproval}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxRiskAllowedForAutoApproval: e.target.value as any,
                  })
                }
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-[var(--foreground)] focus:outline-none"
              >
                <option value="LOW">LOW Risk Only</option>
                <option value="MEDIUM">MEDIUM Risk Allowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: AI Guardrails & System Configuration */}
        <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              AI Guardrails & System Currency
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[var(--foreground)] font-semibold block mb-1">
                Default Currency Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLocalSettings({ ...localSettings, defaultCurrency: 'INR' });
                    if (currency !== 'INR') onToggleCurrency();
                  }}
                  className={`py-2 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                    localSettings.defaultCurrency === 'INR'
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary)]'
                      : 'bg-[var(--background)] text-[var(--foreground-muted)] border-[var(--border)]'
                  }`}
                >
                  ₹ INR (Indian Rupee / Lakhs)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocalSettings({ ...localSettings, defaultCurrency: 'USD' });
                    if (currency !== 'USD') onToggleCurrency();
                  }}
                  className={`py-2 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                    localSettings.defaultCurrency === 'USD'
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary)]'
                      : 'bg-[var(--background)] text-[var(--foreground-muted)] border-[var(--border)]'
                  }`}
                >
                  $ USD (US Dollar)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[var(--foreground)] font-semibold block mb-1">
                AI Quotation Extraction Confidence Floor (%)
              </label>
              <input
                type="number"
                min={50}
                max={99}
                value={localSettings.aiConfidenceThreshold}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    aiConfidenceThreshold: Number(e.target.value),
                  })
                }
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-[var(--foreground)] font-bold focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] cursor-pointer">
                <div>
                  <span className="font-bold text-[var(--foreground)] block">Enable Zero-Touch PO Dispatch</span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">
                    Automatically trigger PO generation on 1-click policy match
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableZeroTouchPoGeneration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      enableZeroTouchPoGeneration: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-[var(--primary)]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] cursor-pointer">
                <div>
                  <span className="font-bold text-[var(--foreground)] block">Anomaly & Incoterms Risk Scans</span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">
                    Flag hidden FOB freight, tariff surcharges, and payment risks
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableAnomalyRiskScans}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      enableAnomalyRiskScans: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-[var(--primary)]"
                />
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
