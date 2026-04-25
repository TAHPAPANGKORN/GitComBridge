"use client";

import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function SuccessPage() {
  return (
    <main className="min-h-screen grid-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="glass-card p-12 text-center max-w-md space-y-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-10 h-10 text-green-400" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white">Welcome to Pro! 🎉</h1>
            <p className="text-white/50 text-sm">
              Your account has been upgraded. All premium themes and features are now unlocked.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-left">
            {["5 Premium Themes", "No Watermark", "Stats Card", "Priority Cache"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-3 h-3" /> {f}
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="block w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-sm transition-all active:scale-95"
          >
            Start Using Pro →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
