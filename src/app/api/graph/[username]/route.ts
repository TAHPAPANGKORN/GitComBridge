import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { decrypt } from "@/lib/utils/encryption";
import { generateSVG, ThemeName, CellSize, GraphLayout } from "@/lib/utils/svg-generator";
import { hasThemeAccess, THEME_TIER } from "@/lib/stripe";

const VALID_THEMES = Object.keys(THEME_TIER) as ThemeName[];
const VALID_CELL_SIZES: CellSize[] = ["S", "M", "L", "XL"];
const VALID_LAYOUTS: GraphLayout[] = ["horizontal", "vertical"];

// --- Per-tier constraints (enforced server-side) ---
const FREE_WEEKS = 52;
const PRO_MAX_WEEKS = 52;
const FREE_CELL_SIZE: CellSize = "L";
const FREE_LAYOUT: GraphLayout = "horizontal";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const searchParams = request.nextUrl.searchParams;

  // Extract raw params from URL
  const requestedTheme   = searchParams.get("theme") ?? "light";
  const requestedWeeks   = parseInt(searchParams.get("weeks") || "52");
  const requestedCell    = searchParams.get("cellSize") as CellSize;
  const requestedLayout  = (searchParams.get("layout") as GraphLayout) || "horizontal";
  const requestedHideWm  = searchParams.get("hideWatermark") === "true";
  const requestedTitle   = searchParams.get("title") || undefined;

  // --- SPECIAL CASE: DEMO DATA ---
  // Demo is always "free" — cannot be used to preview Pro features
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
    // Only allow free themes in demo
    const demoTheme: ThemeName = VALID_THEMES.includes(requestedTheme as ThemeName)
      ? (requestedTheme as ThemeName)
      : "light";
    const resolvedDemoTheme: ThemeName = hasThemeAccess(demoTheme, "free") ? demoTheme : "light";
    const svg = generateSVG(mockGithub, mockGitlab, {
      theme: resolvedDemoTheme,
      layout: FREE_LAYOUT,
      weeks: FREE_WEEKS,
      cellSize: FREE_CELL_SIZE,
    }, "free");
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  }

  try {
    const user = await (prisma.user as any).findFirst({
      where: { name: decodedUsername },
      select: { id: true, name: true, tier: true, accounts: true },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const userTier: "free" | "pro" = user.tier === "pro" ? "pro" : "free";
    const isPro = userTier === "pro";

    // 🔐 Theme — validate allowlist then enforce tier access
    const parsedTheme: ThemeName = VALID_THEMES.includes(requestedTheme as ThemeName)
      ? (requestedTheme as ThemeName)
      : "light";
    const resolvedTheme: ThemeName = hasThemeAccess(parsedTheme, userTier) ? parsedTheme : "light";

    // 🔐 Pro params — free users always get locked defaults regardless of URL
    const weeks: number = isPro
      ? Math.min(Math.max(1, isNaN(requestedWeeks) ? 52 : requestedWeeks), PRO_MAX_WEEKS)
      : FREE_WEEKS;

    const cellSize: CellSize = isPro && VALID_CELL_SIZES.includes(requestedCell)
      ? requestedCell
      : FREE_CELL_SIZE;

    const layout: GraphLayout = isPro && VALID_LAYOUTS.includes(requestedLayout)
      ? requestedLayout
      : FREE_LAYOUT;

    const title        = isPro ? requestedTitle : undefined;
    const hideWatermark = isPro && requestedHideWm;

    let githubData: Record<string, number> = {};
    let gitlabData: Record<string, number> = {};

    for (const account of user.accounts) {
      const rawToken = account.encrypted_access_token || account.access_token;
      if (!rawToken) continue;
      const token = decrypt(rawToken);

      if (account.provider === "github") {
        githubData = await new GitHubService(token).fetchContributions();
      } else if (account.provider === "gitlab") {
        const instanceUrl = (account as any).instance_url || "https://gitlab.com";
        gitlabData = await new GitLabService(token, user.name || "", instanceUrl).fetchContributions();
      }
    }

    const svg = generateSVG(
      githubData,
      gitlabData,
      { theme: resolvedTheme, weeks, cellSize, layout, title, hideWatermark },
      userTier
    );

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": isPro
          ? "public, s-maxage=300, stale-while-revalidate=60"
          : "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Graph Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
