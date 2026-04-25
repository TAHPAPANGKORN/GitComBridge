import { NextResponse } from "next/server";

const BASE_URL = "https://gitcombrigde.vercel.app";

const pages = [
  { url: BASE_URL, changefreq: "weekly", priority: "1.0" },
  { url: `${BASE_URL}/terms`, changefreq: "monthly", priority: "0.5" },
  { url: `${BASE_URL}/privacy`, changefreq: "monthly", priority: "0.5" },
];

export async function GET() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
