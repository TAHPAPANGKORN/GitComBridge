"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Lock } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES_EN = [
  { free: "Dark & Light themes", pro: "9 Premium Themes (Neon, Monokai, Matcha...)" },
  { free: "GitComBridge watermark", pro: "Remove Watermark" },
  { free: "Standard size (L)", pro: "Full size control (S, M, L, XL)" },
  { free: "Horizontal layout only", pro: "Vertical & Horizontal layouts" },
  { free: "Community support", pro: "Priority Support" },
];

const FEATURES_TH = [
  { free: "ธีม Dark & Light", pro: "9 ธีมพรีเมียม (Neon, Monokai, Matcha...)" },
  { free: "มีลายน้ำ GitComBridge", pro: "ลบลายน้ำออกได้" },
  { free: "ขนาดมาตรฐาน (L)", pro: "เลือกขนาดได้เต็มที่ (S, M, L, XL)" },
  { free: "แนวนอนเท่านั้น", pro: "แนวนอน & แนวตั้ง" },
  { free: "Community support", pro: "Priority Support" },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<"EN" | "TH">("EN");

  const FEATURES = lang === "TH" ? FEATURES_TH : FEATURES_EN;
  const txt = {
    EN: {
      title: "Upgrade to Pro",
      subtitle: "Elevate your profile with premium features.",
      currency: "USD",
      billing: "One-time",
      cta: "Get Lifetime Pro Access",
      stripe: "Secure Checkout via Stripe",
      noSub: "No Subscription",
      oneTime: "One-time Payment",
      secure: "Secure Payment",
    },
    TH: {
      title: "อัปเกรดเป็น Pro",
      subtitle: "ยกระดับโปรไฟล์ของคุณด้วยฟีเจอร์พรีเมียม",
      currency: "USD",
      billing: "จ่ายครั้งเดียว",
      cta: "รับสิทธิ์ Pro ตลอดชีพ",
      stripe: "ชำระเงินปลอดภัยผ่าน Stripe",
      noSub: "ไม่มีรายเดือน",
      oneTime: "จ่ายครั้งเดียวตลอดชีพ",
      secure: "ชำระเงินปลอดภัย",
    },
  }[lang];

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
            className={`w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border max-h-[92vh] overflow-y-auto custom-scrollbar ${
              theme === "dark" ? "bg-[#0d1117] border-white/10" : "bg-white border-black/10"
            }`}
          >
            {/* Header */}
            <div className="relative p-6 sm:p-10 pb-0 text-center">
              <button 
                onClick={onClose} 
                className={`absolute right-4 top-4 sm:right-8 sm:top-8 p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'hover:bg-white/5 text-white/30 hover:text-white' : 'hover:bg-black/5 text-black/30 hover:text-black'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-purple-500 to-blue-500 p-0.5 mx-auto mb-4 sm:mb-6 shadow-2xl shadow-purple-500/20"
              >
                <div className={`w-full h-full rounded-[1.4rem] sm:rounded-[1.9rem] flex items-center justify-center ${theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white'}`}>
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-transparent bg-gradient-to-br from-purple-500 to-blue-500 bg-clip-text fill-purple-500" />
                </div>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{txt.title}</h2>
              <p className="text-xs sm:text-sm opacity-50 mt-2 font-medium">{txt.subtitle}</p>
              {/* Language Toggle */}
              <div className="flex items-center justify-center gap-1 mt-3">
                {(["EN", "TH"] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all border ${
                      lang === l
                        ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                        : theme === "dark" ? "border-white/10 bg-white/5 opacity-40 hover:opacity-70" : "border-black/10 bg-black/5 opacity-40 hover:opacity-70"
                    }`}>{l}</button>
                ))}
              </div>
            </div>

            {/* Price Card */}
            <div className="flex items-center justify-center gap-4 py-8 sm:py-10 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
               
               <div className="relative flex items-baseline gap-2">
                 <span className="text-6xl sm:text-7xl font-black tracking-tighter">$9</span>
                 <div className="flex flex-col">
                   <span className="text-2xl font-black tracking-tight">.99</span>
                   <span className="text-xs sm:text-sm font-black text-purple-400">{txt.currency}</span>
                   <span className="text-[10px] sm:text-xs font-bold opacity-30 uppercase tracking-widest">{txt.billing}</span>
                 </div>
               </div>
            </div>

            {/* Feature Comparison */}
            <div className="px-6 sm:px-10 pb-8 sm:pb-10 space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-[9px] sm:text-[10px] mb-4 sm:mb-6">
                <div className={`py-2 px-3 sm:px-4 rounded-xl text-center font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] border ${
                  theme === "dark" ? "bg-white/2 border-white/5 opacity-30" : "bg-black/2 border-black/5 opacity-30"
                }`}>
                  Free
                </div>
                <div className="py-2 px-3 sm:px-4 rounded-xl text-center font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/5">
                  ✦ Pro
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {FEATURES.map((f, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-medium">
                    <div className="flex items-center gap-2 sm:gap-3 opacity-30">
                      <div className="w-1 h-1 rounded-full bg-current opacity-20" />
                      <span>{f.free}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-current">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" strokeWidth={3} />
                      </div>
                      <span className="font-bold">{f.pro}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 sm:pt-8">
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_15px_40px_rgba(124,58,237,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex flex-col items-center justify-center group relative overflow-hidden"
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
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <span className="text-white font-black text-sm sm:text-base">{txt.cta}</span>
                    </div>
                  )}
                  {!isLoading && <span className="text-[8px] sm:text-[9px] text-white/60 font-bold uppercase tracking-widest mt-0.5">{txt.stripe}</span>}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 sm:mt-6 opacity-30 text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter">
                <span>{txt.noSub}</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-current" />
                <span>{txt.oneTime}</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-current" />
                <span>{txt.secure}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
