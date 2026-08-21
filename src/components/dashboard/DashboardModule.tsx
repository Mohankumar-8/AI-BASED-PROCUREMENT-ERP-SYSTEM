import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldAlert, 
  FileText, 
  PieChart as PieIcon, 
  BarChart3,
  Scale,
  Award,
  Sparkle
} from 'lucide-react';
import { RFQ, PurchaseOrder, ProcurementStage } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface DashboardModuleProps {
  rfqs: RFQ[];
  activeRfq: RFQ;
  pos: PurchaseOrder[];
  onSelectRfq: (rfq: RFQ) => void;
  onNavigate: (stage: ProcurementStage) => void;
  currency: 'INR' | 'USD';
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  rfqs,
  activeRfq,
  pos,
  onSelectRfq,
  onNavigate,
  currency,
}) => {
  // Aggregate Metrics
  const totalSpend = 48500000; // ₹4.85 Cr
  const potentialSavings = 4200000; // ₹42 Lakhs
  const activeRfqsCount = rfqs.length;
  const pendingApprovalsCount = rfqs.filter((r) => r.approvalStatus === 'pending' || r.status === 'decision_ready').length;
  const riskAlertsCount = 3;
  const avgCycleTimeDays = '4.2 Days'; // Reduced from 18 days via AI

  // Monthly Spending Data for Chart
  const monthlySpendData = [
    { month: 'Apr', spend: 3200000, budget: 3500000 },
    { month: 'May', spend: 4100000, budget: 4500000 },
    { month: 'Jun', spend: 3800000, budget: 4000000 },
    { month: 'Jul', spend: 5200000, budget: 5500000 },
    { month: 'Aug (YTD)', spend: 4900000, budget: 5000000 },
  ];

  // Category Spending Breakdown with Restrained Colors
  const categorySpend = [
    { name: 'IT Hardware & Networking', amount: 24500000, pct: 51, color: 'bg-[var(--primary)]' },
    { name: 'Facility & Ergonomics', amount: 11200000, pct: 23, color: 'bg-[var(--secondary)]' },
    { name: 'Cloud & Software Licensing', amount: 8200000, pct: 17, color: 'bg-[var(--accent)]' },
    { name: 'Logistics & Warehouse Ops', amount: 4600000, pct: 9, color: 'bg-[var(--info)]' },
  ];

  // Vendor Performance Benchmark Data
  const vendorPerformance = [
    { name: 'Vendor C (CloudTech)', reliability: 96, onTime: 96, quality: 97, tier: 'Preferred' },
    { name: 'Vendor A (Apex Systems)', reliability: 91, onTime: 91, quality: 92, tier: 'Preferred' },
    { name: 'Vendor B (Nexus Global)', reliability: 74, onTime: 74, quality: 78, tier: 'Standard' },
    { name: 'ErgoFlex Workspace', reliability: 95, onTime: 96, quality: 96, tier: 'Preferred' },
  ];

  return (
    <div id="dashboard-module-container" className="space-y-6 pb-12">
      {/* Executive Hero Banner */}
      <div className="p-4 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--secondary)]/30">
              EXECUTIVE PROCUREMENT DASHBOARD
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-medium">Enterprise Intelligence Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Procurement Overview & Spend Intelligence
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-2xl leading-relaxed">
            Real-time spend analytics, verified True Landed Cost savings, vendor SLA performance benchmarks, and automated policy governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('purchase_requests')}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--border)]/50 text-[var(--foreground)] text-xs font-semibold border border-[var(--border)] transition-colors cursor-pointer touch-target text-center"
          >
            + New PR
          </button>
          <button
            onClick={() => onNavigate('ai_analysis')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer touch-target"
          >
            <Scale className="w-4 h-4" />
            <span>Launch AI Analysis</span>
          </button>
        </div>
      </div>

      {/* 6 Core Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {/* KPI 1: Total Spend */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)]">
            <span className="text-[11px] font-medium">Total Spend</span>
            <DollarSign className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            {formatCurrency(totalSpend, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--success)] flex items-center gap-1 font-semibold truncate">
            <TrendingUp className="w-3 h-3 shrink-0" /> +12.4% YTD
          </div>
        </div>

        {/* KPI 2: Potential Savings */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)]">
            <span className="text-[11px] font-medium">Potential Savings</span>
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--primary)]">
            {formatCurrency(potentialSavings, currency, true)}
          </div>
          <div className="text-[10px] text-[var(--foreground-muted)] font-medium truncate">
            8.6% Landed Savings
          </div>
        </div>

        {/* KPI 3: Active RFQs */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)]">
            <span className="text-[11px] font-medium">Active RFQs</span>
            <Layers className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            {activeRfqsCount}
          </div>
          <div className="text-[10px] text-[var(--foreground-muted)] font-medium truncate">
            3 Ingesting Quotes
          </div>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)]">
            <span className="text-[11px] font-medium">Pending Approvals</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--accent)]">
            {pendingApprovalsCount}
          </div>
          <div className="text-[10px] text-[var(--foreground-muted)] font-medium truncate">
            1 Auto-Pass Ready
          </div>
        </div>

        {/* KPI 5: Risk Alerts */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)]">
            <span className="text-[11px] font-medium">Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--danger)]">
            {riskAlertsCount}
          </div>
          <div className="text-[10px] text-[var(--danger)] font-medium truncate">
            FOB Traps Detected
          </div>
        </div>

        {/* KPI 6: Average Cycle Time */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)]">
            <span className="text-[11px] font-medium">Avg Cycle Time</span>
            <Clock className="w-4 h-4 text-[var(--foreground-muted)]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            {avgCycleTimeDays}
          </div>
          <div className="text-[10px] text-[var(--success)] flex items-center gap-1 font-semibold truncate">
            <TrendingUp className="w-3 h-3 rotate-180 shrink-0" /> -76% vs ERP
          </div>
        </div>
      </div>

      {/* AI Strategic Procurement Insights Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border-l-4 border-l-[var(--primary)] border-t border-r border-b border-[var(--border)] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              AI Strategic Procurement Insights
            </h2>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30">
            Intelligence Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 text-xs">
          <div className="p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
              <Award className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Multi-Purchase Cost Reduction</span>
            </div>
            <p className="text-[var(--foreground)] text-[11px] leading-relaxed">
              <strong>Vendor C</strong> could reduce projected procurement cost by <strong>₹1.2L</strong> across the next three purchases if batched under the Master Hardware Agreement.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--danger-light)] border border-[var(--danger)]/25 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[var(--danger)] font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-[var(--danger)]" />
              <span>Hidden Freight Risk Anomaly</span>
            </div>
            <p className="text-[var(--foreground)] text-[11px] leading-relaxed">
              <strong>Vendor B</strong> quotes an artificially low base price (₹44L), but offloads <strong>₹7.0L</strong> in international air freight, port customs, and warranty surcharges onto VendraX.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--primary-light)] border border-[var(--secondary)]/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>Zero-Touch Policy Compliance</span>
            </div>
            <p className="text-[var(--foreground)] text-[11px] leading-relaxed">
              <strong>RFQ-2026-089</strong> qualifies for instantaneous 1-click PO release. Vendor C achieved <strong>94/100</strong> AI Score with 100% policy compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Spending Waterfall & Performance Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chart 1: Monthly Procurement Spending vs Budget */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Monthly Procurement Spending vs Budget
                </h3>
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)] font-medium">Values in {currency}</span>
            </div>

            {/* Bar Visualization */}
            <div className="space-y-3 pt-2">
              {monthlySpendData.map((item, idx) => {
                const spendPct = Math.round((item.spend / item.budget) * 100);
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)] font-semibold">{item.month}</span>
                      <span className="text-[var(--foreground-muted)]">
                        <strong className="text-[var(--primary)] font-bold">{formatCurrency(item.spend, currency, true)}</strong> / {formatCurrency(item.budget, currency, true)} ({spendPct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[var(--border)] rounded-full overflow-hidden flex">
                      <div
                        className="bg-[var(--primary)] h-full rounded-full transition-all duration-500"
                        style={{ width: `${spendPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Vendor Performance Benchmark Data */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Tier-1 Vendor Reliability & SLA Performance
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('vendor_intelligence')}
                className="text-[10px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)] font-medium">
                    <th className="pb-2 pl-2">Vendor Name</th>
                    <th className="pb-2 text-center">On-Time %</th>
                    <th className="pb-2 text-center">Quality %</th>
                    <th className="pb-2 text-center">Reliability</th>
                    <th className="pb-2 text-right pr-2">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {vendorPerformance.map((v, i) => (
                    <tr key={i} className="hover:bg-[var(--background)] transition-colors">
                      <td className="py-2.5 pl-2 font-bold text-[var(--foreground)]">{v.name}</td>
                      <td className="py-2.5 text-center font-semibold text-[var(--success)]">{v.onTime}%</td>
                      <td className="py-2.5 text-center font-semibold text-[var(--primary)]">{v.quality}%</td>
                      <td className="py-2.5 text-center font-bold text-[var(--foreground)]">{v.reliability}%</td>
                      <td className="py-2.5 text-right pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          v.tier === 'Preferred' 
                            ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--secondary)]/40'
                            : 'bg-[var(--background)] text-[var(--foreground-muted)] border-[var(--border)]'
                        }`}>
                          {v.tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="sm:hidden space-y-2.5">
              {vendorPerformance.map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--foreground)]">{v.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                      v.tier === 'Preferred' 
                        ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--secondary)]/40'
                        : 'bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)]'
                    }`}>
                      {v.tier}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--border)] text-center text-[11px]">
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">On-Time</span>
                      <span className="font-bold text-[var(--success)]">{v.onTime}%</span>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">Quality</span>
                      <span className="font-bold text-[var(--primary)]">{v.quality}%</span>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">Reliability</span>
                      <span className="font-bold text-[var(--foreground)]">{v.reliability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Category Spend & Recent Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Spending Chart */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Spend by Category
                </h3>
              </div>
              <span className="text-[10px] text-[var(--foreground-muted)] font-medium">Total: {formatCurrency(totalSpend, currency, true)}</span>
            </div>

            <div className="space-y-3">
              {categorySpend.map((cat, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)] font-medium">{cat.name}</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {formatCurrency(cat.amount, currency, true)} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent RFQs Active Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Active RFQs
                </h3>
              </div>
              <button
                onClick={() => onNavigate('rfqs')}
                className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {rfqs.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRfq(r);
                    onNavigate('ai_analysis');
                  }}
                  className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-colors space-y-1.5 touch-target"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--primary)]">{r.rfqNumber}</span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] uppercase">
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[var(--foreground)] truncate">{r.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
                    <span>Budget: {formatCurrency(r.targetBudget, currency, true)}</span>
                    <span className="text-[var(--primary)] flex items-center gap-1 font-semibold">
                      Analyze Quotes <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Purchase Orders Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Recent Purchase Orders
                </h3>
              </div>
              <button
                onClick={() => onNavigate('purchase_orders')}
                className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
              >
                View POs
              </button>
            </div>

            <div className="space-y-2.5">
              {pos.map((po) => (
                <div
                  key={po.id}
                  onClick={() => onNavigate('purchase_orders')}
                  className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--success)] cursor-pointer transition-colors space-y-1 touch-target"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--primary)]">{po.poNumber}</span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--success)] border border-[var(--secondary)]/30 uppercase">
                      {po.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[var(--foreground)] truncate">{po.vendorName}</div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
                    <span className="font-semibold text-[var(--foreground)]">{formatCurrency(po.totalAmount, currency, false)}</span>
                    <span>ETA: {po.deliveryDueDate}</span>
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
