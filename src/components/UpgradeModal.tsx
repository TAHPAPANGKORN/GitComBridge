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
  { free: "Dark & Light themes", pro: "5 Premium themes (Ocean, Sunset, Neon, Dracula, Nord)" },
  { free: "gitcombrigde.vercel.app watermark", pro: "No watermark" },
  { free: "Standard graph (1 year)", pro: "Custom graph sizes (coming soon)" },
  { free: "Community support", pro: "Priority support" },
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
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border ${
              theme === "dark" ? "bg-[#0d1117] border-white/10" : "bg-white border-black/10"
            }`}
          >
            {/* Header */}
            <div className="relative p-8 pb-0 text-center">
              <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-4 h-4 opacity-50" />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-black">Upgrade to Pro</h2>
              <p className="text-sm opacity-50 mt-1">One-time payment. Yours forever.</p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 py-6">
              <span className="text-5xl font-black">$9</span>
              <div className="text-left">
                <div className="text-xs opacity-40">USD</div>
                <div className="text-xs opacity-40">one-time</div>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="px-8 pb-8 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className={`p-3 rounded-2xl text-center font-bold ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`}>
                  Free
                </div>
                <div className="p-3 rounded-2xl text-center font-bold bg-purple-500/20 text-purple-400">
                  ✦ Pro
                </div>
              </div>

              {FEATURES.map((f, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2 opacity-50">
                    <span className="mt-0.5 text-[10px]">—</span>
                    <span>{f.free}</span>
                  </div>
                  <div className="flex items-start gap-2 text-purple-400">
                    <Check className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{f.pro}</span>
                  </div>
                </div>
              ))}

              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-sm transition-all active:scale-95 shadow-lg shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : <Sparkles className="w-4 h-4" />}
                {isLoading ? "Redirecting to Stripe..." : "Upgrade Now — $9"}
              </button>

              <p className="text-center text-[10px] opacity-30">
                Secured by Stripe • No subscription • Cancel anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
