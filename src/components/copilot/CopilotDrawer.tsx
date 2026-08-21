import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  X,
  Sparkle
} from 'lucide-react';
import { RFQ, VendorQuote, CopilotMessage, ProcurementStage } from '../../types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRfq: RFQ;
  quotes: VendorQuote[];
  onNavigate: (stage: ProcurementStage) => void;
  onApproveWinner: () => void;
  currency: 'INR' | 'USD';
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeRfq,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello! I am your **VendraX AI Procurement Copilot**.\n\nI have evaluated the **100x Enterprise Laptops RFQ** across all submitted quotes. **Vendor C (Score: 94/100)** is the optimal recommended choice with ₹49L all-inclusive True Cost, 5-day delivery, and a 3-year on-site SLA.\n\nHow can I assist your procurement workflow today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Which vendor should I select?',
    'Why is Vendor B not recommended?',
    'How much can we save?',
    'Show high-risk vendors.',
    'Generate PO for winner.'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          rfqContext: activeRfq,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const aiMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: result.reply || generateSmartLocalResponse(query),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        fallbackResponse(query);
      }
    } catch {
      fallbackResponse(query);
    } finally {
      setIsTyping(false);
    }
  };

  const fallbackResponse = (query: string) => {
    setTimeout(() => {
      const reply = generateSmartLocalResponse(query);
      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const generateSmartLocalResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('which vendor') || q.includes('select') || q.includes('who won')) {
      return `### Recommendation: **Vendor C (CloudTech & CyberCore)**\n\n- **AI Composite Score**: **94 / 100**\n- **True Landed Cost**: **₹49,00,000** (₹1.0L below budget)\n- **Fulfillment Time**: **5 Days** (Fastest available)\n- **Warranty Coverage**: **3 Years On-Site 24x7 SLA**\n- **Historical Reliability**: **96% on-time record, 0.2% defect rate**\n\nVendor C provides the highest overall value and zero hidden freight fees.`;
    }

    if (q.includes('vendor b') || q.includes('why not') || q.includes('false economy')) {
      return `### Why Vendor B is **NOT Recommended** (False Economy Trap):\n\n1. **Hidden Shipping Fees**: Quotes ₹44L under **FOB Kaohsiung**, leaving ~₹4.5L freight and ₹1.5L customs to be paid by VendraX, driving True Cost to **₹51,00,000**.\n2. **Severe Delivery Delay**: Promises **18-day lead time**, which breaches your mandatory 10-day project deadline.\n3. **Payment Risk**: Demands **30% advance cash** prior to dispatch.\n4. **Short Warranty**: Offers only **1-year overseas return-to-bench** warranty.`;
    }

    if (q.includes('save') || q.includes('savings') || q.includes('cost')) {
      return `### Projected Savings Analysis:\n\n- **Direct Budget Savings**: **₹1,00,000 (2.0%)** below the ₹50,00,000 ceiling.\n- **Savings vs Next Best Landed Bid**: **₹2,00,000** lower than Vendor B's true landed cost (₹51L).\n- **Lifecycle Value**: An estimated **₹1,80,000** in avoided maintenance from Vendor C's included 3-year on-site SLA vs standard 1-year coverage.`;
    }

    if (q.includes('high-risk') || q.includes('risk') || q.includes('anomalies')) {
      return `### Current Risk Overview:\n\n- **Vendor B**: 🔴 **HIGH RISK** (FOB freight trap, 18-day lead time violation, 30% advance payment required).\n- **Vendor A**: 🟢 **LOW RISK** (Solid domestic vendor, ₹50L true cost, 2-year depot warranty).\n- **Vendor C**: 🟢 **LOW RISK** (100% compliant DDP delivery, 96% reliability score).`;
    }

    if (q.includes('generate po') || q.includes('approve') || q.includes('purchase order')) {
      return `### Autonomous PO Trigger Ready\n\nI can execute zero-touch purchase order generation for **Vendor C** under **PO-2026-089-VENDRAX** at **₹49,00,000**.\n\nClick **"Approve & Generate PO"** on the analysis page or let me initiate it for you.`;
    }

    return `I analyzed your request regarding **${query}**. All quotations have been normalized under the True Procurement Cost formula:\n\n\`Base Price + Tax + Shipping + Installation + Maintenance - Discount = True Cost\`\n\nVendor C remains the top ranked supplier with a score of 94/100. Would you like me to draft an electronic counter-offer or prepare the purchase order?`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] max-w-full bg-[var(--surface)] border-l border-[var(--border)] z-50 shadow-xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--surface)] shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <span>VendraX AI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
              </div>
              <div className="text-[10px] text-[var(--foreground-muted)]">Context: {activeRfq?.rfqNumber}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center justify-center text-xs transition-colors cursor-pointer touch-target"
            aria-label="Close copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-xl max-w-[90%] space-y-1.5 leading-relaxed shadow-xs ${
                  m.role === 'user'
                    ? 'bg-[var(--primary)] text-[var(--surface)] rounded-br-none font-medium'
                    : 'bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line text-xs">{m.content}</div>
                <div className={`text-[9px] text-right ${m.role === 'user' ? 'text-[var(--surface)]/80' : 'text-[var(--foreground-muted)]'}`}>{m.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[var(--primary)] p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing procurement telemetry & vendor ranking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--background)] space-y-1.5">
          <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block">
            Quick Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface)] hover:bg-[var(--primary-light)] text-[11px] text-[var(--primary)] border border-[var(--border)] hover:border-[var(--secondary)] transition-colors text-left cursor-pointer touch-target"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--background)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about vendors, true costs, or risks..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] touch-target"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="w-10 h-10 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] flex items-center justify-center shadow-xs disabled:opacity-40 transition-colors shrink-0 cursor-pointer touch-target"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
