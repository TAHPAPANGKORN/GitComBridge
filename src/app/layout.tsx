import "@/app/globals.css";
import { Providers } from "@/components/Providers";
import { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://gitcombridge.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GitComBridge | Unified GitHub & GitLab Contribution Graph",
    template: "%s | GitComBridge",
  },
  description:
    "Combine your GitHub and GitLab contribution history into one beautiful, unified graph for your profile README. Free tool for developers.",
  keywords: [
    "GitHub contribution graph",
    "GitLab contribution graph",
    "unified contribution graph",
    "developer portfolio",
    "GitHub profile README",
    "GitLab activity",
    "open source",
    "developer tools",
    "contribution heatmap",
    "GitComBridge",
  ],
  authors: [{ name: "Papangkorn Pitjawong", url: BASE_URL }],
  creator: "Papangkorn Pitjawong",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "GitComBridge",
    title: "GitComBridge | Unified GitHub & GitLab Contribution Graph",
    description:
      "Combine your GitHub and GitLab contribution history into one beautiful graph for your profile README. Free. Secure. Real-time.",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "GitComBridge – Unified Contribution Graph",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitComBridge | Unified GitHub & GitLab Contribution Graph",
    description:
      "Combine your GitHub and GitLab contribution history into one beautiful graph. Free for developers.",
    images: [`${BASE_URL}/logo.png`],
    creator: "@tahpapangkorn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "UndXf5jbpV8DXacq_ykKB3fFwXi72N63QVn_J0vy3NU",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GitComBridge",
  url: BASE_URL,
  description:
    "A free tool to combine GitHub and GitLab contribution graphs into one unified heatmap for your developer profile.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Papangkorn P.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
