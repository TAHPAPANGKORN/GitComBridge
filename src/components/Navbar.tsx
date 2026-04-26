"use client";

import React from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Globe, LogOut, Moon, Sun, Trash2, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteCountdown, setDeleteCountdown] = React.useState(5);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [userTier, setUserTier] = React.useState<'free' | 'pro'>('free');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Fetch tier from server (DB) when session is available
  React.useEffect(() => {
    if (!session?.user) return;
    fetch('/api/user/status')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.tier) setUserTier(data.tier); })
      .catch(() => {});
  }, [session]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Countdown timer when modal is open
  React.useEffect(() => {
    if (!showDeleteModal) {
      setDeleteCountdown(5);
      return;
    }
    if (deleteCountdown <= 0) return;
    const timer = setTimeout(() => setDeleteCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showDeleteModal, deleteCountdown]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (res.ok) {
        signOut({ callbackUrl: '/' });
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 group-hover:scale-110 transition-all duration-300">
            <img 
              src="/logo.png" 
              alt="GitComBridge Logo" 
              className="w-full h-full object-cover shadow-lg shadow-gitlab-purple/20" 
            />
          </div>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-current to-current/50 bg-clip-text">
            GitComBridge
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-current"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setLanguage(language === "EN" ? "TH" : "EN")}
            className="flex items-center gap-1 text-sm hover:text-white transition-colors px-2"
          >
            <Globe className="w-4 h-4" />
            {language}
          </button>

          {session ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <span className="text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity hidden sm:block">
                  {session.user?.name?.split(' ')[0]}
                </span>
                {/* Tier mini badge on trigger */}
                {userTier === 'pro' ? (
                  <span className="hidden sm:flex items-center gap-0.5 text-[9px] font-black text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" /> PRO
                  </span>
                ) : null}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-gitlab-gradient flex items-center justify-center">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">
                      {session.user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-3 w-64 border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden z-[100] ${
                      theme === 'dark'
                        ? 'bg-[#0d1117] border-white/10'
                        : 'bg-white border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
                    }`}
                  >
                    <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{session.user?.name}</p>
                        {/* Tier Badge */}
                        {userTier === 'pro' ? (
                          <span className="flex items-center gap-1 text-[9px] font-black text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full shrink-0">
                            <Sparkles className="w-2.5 h-2.5" /> PRO
                          </span>
                        ) : (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            theme === 'dark' ? 'bg-white/5 text-white/30' : 'bg-black/5 text-black/30'
                          }`}>
                            FREE
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`}>{session.user?.email}</p>
                      {/* Upgrade prompt for free users */}
                      {userTier === 'free' && (
                        <a href="/?upgrade=1"
                          onClick={() => setIsDropdownOpen(false)}
                          className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors">
                          <Crown className="w-3 h-3" /> Upgrade to Pro — $9
                        </a>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <button 
                        onClick={() => signOut()}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium rounded-xl transition-all ${
                          theme === 'dark'
                            ? 'text-white/70 hover:text-white hover:bg-white/10'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                        }`}
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>

                    <div className={`p-2 border-t bg-red-500/5 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                      <button 
                        onClick={() => { setIsDropdownOpen(false); setShowDeleteModal(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> {t("delete_account_btn")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </nav>

    {/* Delete Account Confirmation Modal */}
    <AnimatePresence>
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border ${
              theme === 'dark' 
                ? 'bg-[#0d1117] border-white/10' 
                : 'bg-white border-black/10'
            }`}
          >
            {/* Header */}
            <div className="p-8 text-center space-y-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto"
              >
                <Trash2 className="w-8 h-8 text-red-500" />
              </motion.div>
              <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t("delete_account_title")}
              </h2>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                {t("delete_account_desc")}
              </p>
            </div>

            {/* Warning Bar */}
            <div className="mx-6 mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
                {t("delete_confirm_msg")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-8 flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteCountdown > 0 || isDeleting}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all relative overflow-hidden ${
                  deleteCountdown > 0 || isDeleting
                    ? 'bg-red-500/20 text-red-500/40 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white active:scale-95 shadow-lg shadow-red-500/30'
                }`}
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Deleting...
                  </span>
                ) : deleteCountdown > 0 ? (
                  `${t("delete_account_btn")} (${deleteCountdown})`
                ) : (
                  t("delete_account_btn")
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    : 'bg-black/5 hover:bg-black/10 text-gray-600 hover:text-gray-900'
                }`}
              >
                {t("cancel_btn")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
