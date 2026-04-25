"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Lock, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main className="min-h-screen grid-bg selection:bg-gitlab-purple/30">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-40 pb-20 px-6">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-sm text-github-text hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("back_btn")}
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 space-y-8"
        >
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black">{t("privacy_title")}</h1>
          <div className="prose prose-invert max-w-none opacity-80 leading-relaxed space-y-8">
             <p className="text-lg">{t("privacy_content")}</p>
             <hr className="border-white/10" />
             <div className="space-y-6">
                <div className="space-y-2">
                   <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t("privacy_sub1_title")}</h3>
                   <p className="text-sm">{t("privacy_sub1_desc")}</p>
                </div>
                <div className="space-y-2">
                   <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t("privacy_sub2_title")}</h3>
                   <p className="text-sm">{t("privacy_sub2_desc")}</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
