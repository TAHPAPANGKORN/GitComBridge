"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function CanceledPage() {
  return (
    <main className="min-h-screen grid-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-12 text-center max-w-md space-y-6"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-white/30" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black">Payment Canceled</h1>
            <p className="text-white/40 text-sm">
              No worries — you were not charged. You can upgrade anytime.
            </p>
          </div>
          <Link
            href="/"
            className="block w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm transition-all"
          >
            ← Back to GitComBridge
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
