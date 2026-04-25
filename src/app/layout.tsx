import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Unified Contribution Graph Generator",
  description: "Combine your GitHub and GitLab contributions into one beautiful graph.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
