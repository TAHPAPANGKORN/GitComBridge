"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function TermsContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSignin = searchParams.get("from") === "signin";

  const handleBack = () => {
    if (fromSignin) {
      router.push("/auth/signin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-40 pb-20 px-6">
      <button 
        onClick={handleBack} 
        className="inline-flex items-center gap-2 text-sm text-github-text hover:text-white transition-colors mb-8 group cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t("back_btn")}
      </button>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 space-y-8"
      >
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black">{t("terms_title")}</h1>
        <div className="prose prose-invert max-w-none opacity-80 leading-relaxed space-y-8">
          <p className="text-lg">{t("terms_content")}</p>
          <hr className="border-white/10" />
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t("terms_sub1_title")}</h3>
              <p className="text-sm">{t("terms_sub1_desc")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t("terms_sub2_title")}</h3>
              <p className="text-sm">{t("terms_sub2_desc")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">{t("terms_sub3_title")}</h3>
              <p className="text-sm">{t("terms_sub3_desc")}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-8 border-t border-white/5">
          <Link 
            href={fromSignin ? "/privacy?from=signin" : "/privacy"} 
            className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 group cursor-pointer"
          >
            {t("privacy_title")} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen grid-bg selection:bg-gitlab-purple/30">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-3xl mx-auto pt-40 pb-20 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }>
        <TermsContent />
      </Suspense>
    </main>
  );
}
