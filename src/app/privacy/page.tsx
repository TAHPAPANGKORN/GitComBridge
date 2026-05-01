import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy for GitComBridge. Learn how we handle your GitHub and GitLab data with maximum privacy and security.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen grid-bg selection:bg-gitlab-purple/30">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-3xl mx-auto pt-40 pb-20 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }>
        <PrivacyClient />
      </Suspense>
    </main>
  );
}
