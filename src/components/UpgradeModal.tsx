"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Lock } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES = [
  { free: "Dark & Light themes", pro: "7 Premium Themes (Neon, Monokai, Sakura...)" },
  { free: "GitComBridge watermark", pro: "Remove Watermark" },
  { free: "Standard size (L)", pro: "Full size control (S, M, L, XL)" },
  { free: "Horizontal layout only", pro: "Vertical & Horizontal layouts" },
  { free: "Community support", pro: "Priority Support" },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border ${
              theme === "dark" ? "bg-[#0d1117] border-white/10" : "bg-white border-black/10"
            }`}
          >
            {/* Header */}
            <div className="relative p-10 pb-0 text-center">
              <button 
                onClick={onClose} 
                className={`absolute right-8 top-8 p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'hover:bg-white/5 text-white/30 hover:text-white' : 'hover:bg-black/5 text-black/30 hover:text-black'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-500 to-blue-500 p-0.5 mx-auto mb-6 shadow-2xl shadow-purple-500/20"
              >
                <div className={`w-full h-full rounded-[1.9rem] flex items-center justify-center ${theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white'}`}>
                  <Sparkles className="w-10 h-10 text-transparent bg-gradient-to-br from-purple-500 to-blue-500 bg-clip-text fill-purple-500" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl font-black tracking-tight">Upgrade to Pro</h2>
              <p className="text-sm opacity-50 mt-2 font-medium">Elevate your profile with premium features.</p>
            </div>

            {/* Price Card */}
            <div className="flex items-center justify-center gap-4 py-10 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
               
               <div className="relative flex items-baseline gap-2">
                 <span className="text-7xl font-black tracking-tighter">$9</span>
                 <div className="flex flex-col">
                   <span className="text-sm font-black text-purple-400">USD</span>
                   <span className="text-xs font-bold opacity-30 uppercase tracking-widest">One-time</span>
                 </div>
               </div>
            </div>

            {/* Feature Comparison */}
            <div className="px-10 pb-10 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-[10px] mb-6">
                <div className={`py-2 px-4 rounded-xl text-center font-black uppercase tracking-[0.2em] border ${
                  theme === "dark" ? "bg-white/2 border-white/5 opacity-30" : "bg-black/2 border-black/5 opacity-30"
                }`}>
                  Free
                </div>
                <div className="py-2 px-4 rounded-xl text-center font-black uppercase tracking-[0.2em] bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/5">
                  ✦ Pro
                </div>
              </div>

              <div className="space-y-4">
                {FEATURES.map((f, i) => (
                  <div key={i} className="grid grid-cols-2 gap-6 text-[11px] font-medium">
                    <div className="flex items-center gap-3 opacity-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20" />
                      <span>{f.free}</span>
                    </div>
                    <div className="flex items-center gap-3 text-current">
                      <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-purple-400" strokeWidth={3} />
                      </div>
                      <span className="font-bold">{f.pro}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_15px_40px_rgba(124,58,237,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex flex-col items-center justify-center group relative overflow-hidden"
                >
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {isLoading ? (
                    <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-white" />
                      <span className="text-white font-black text-base">Get Lifetime Pro Access</span>
                    </div>
                  )}
                  {!isLoading && <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest mt-0.5">Secure Checkout via Stripe</span>}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 opacity-30 text-[9px] font-bold uppercase tracking-tighter">
                <span>No Subscription</span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span>One-time Payment</span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span>Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
