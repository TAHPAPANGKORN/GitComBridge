import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for GitComBridge. Understand your rights and responsibilities when using our unified contribution graph tool.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen grid-bg selection:bg-gitlab-purple/30">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-3xl mx-auto pt-40 pb-20 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }>
        <TermsClient />
      </Suspense>
    </main>
  );
}
