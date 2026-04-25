import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { decrypt } from "@/lib/utils/encryption";
import { generateSVG, ThemeName } from "@/lib/utils/svg-generator";
import { hasThemeAccess, THEME_TIER } from "@/lib/stripe";

const VALID_THEMES = Object.keys(THEME_TIER) as ThemeName[];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const searchParams = request.nextUrl.searchParams;

  // Sanitize theme — only accept known themes
  const requestedTheme = searchParams.get("theme") ?? "dark";
  const theme: ThemeName = VALID_THEMES.includes(requestedTheme as ThemeName)
    ? (requestedTheme as ThemeName)
    : "dark";

  // --- SPECIAL CASE: DEMO DATA (always free tier) ---
  if (decodedUsername === "demo") {
    const mockGithub: Record<string, number> = {};
    const mockGitlab: Record<string, number> = {};
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      if (Math.random() > 0.7) mockGithub[dateStr] = Math.floor(Math.random() * 5) + 1;
      if (Math.random() > 0.8) mockGitlab[dateStr] = Math.floor(Math.random() * 5) + 1;
    }
    const svg = generateSVG(mockGithub, mockGitlab, "dark", "free");
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  }

  try {
    // 🔐 SECURITY: Always fetch tier from DB — never trust URL params
    const user = await (prisma.user as any).findFirst({
      where: { name: decodedUsername },
      select: {
        id: true,
        name: true,
        tier: true,
        accounts: true,
      },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const userTier: "free" | "pro" = user.tier === "pro" ? "pro" : "free";

    // 🔐 SECURITY: Server-side theme access check — fallback silently if unauthorized
    const resolvedTheme: ThemeName = hasThemeAccess(theme, userTier) ? theme : "dark";

    let githubData = {};
    let gitlabData = {};

    for (const account of user.accounts) {
      const rawToken = account.encrypted_access_token || account.access_token;
      if (!rawToken) continue;

      const token = decrypt(rawToken);

      if (account.provider === "github") {
        const ghService = new GitHubService(token);
        githubData = await ghService.fetchContributions();
      } else if (account.provider === "gitlab") {
        const instanceUrl = (account as any).instance_url || "https://gitlab.com";
        const glService = new GitLabService(token, user.name || "", instanceUrl);
        gitlabData = await glService.fetchContributions();
      }
    }

    // Pass userTier so SVG generator adds/removes watermark correctly
    const svg = generateSVG(githubData, gitlabData, resolvedTheme, userTier);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        // Pro users get shorter cache so their graph updates faster
        "Cache-Control": userTier === "pro"
          ? "public, s-maxage=300, stale-while-revalidate=60"
          : "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Graph Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
