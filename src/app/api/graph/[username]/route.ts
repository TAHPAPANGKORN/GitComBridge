import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { refreshAccountToken } from "@/lib/utils/token-refresher";
import { generateSVG, ThemeName, CellSize, GraphLayout, AnimationType } from "@/lib/utils/svg-generator";
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
  const requestedAnim    = (searchParams.get("animation") as AnimationType) || "none";

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
      animation: requestedAnim,
    }, "pro");
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  }

  try {
    const user = await prisma.user.findFirst({
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

    const timezone      = searchParams.get("timezone") || "Asia/Bangkok";
    
    const theme        = resolvedTheme;
    const title        = isPro ? requestedTitle : undefined;
    const hideWatermark = isPro && requestedHideWm;

    // Fetch both platforms in parallel for maximum speed
    const fetchPromises = user.accounts.map(async (account: any) => {
      // 🔄 Auto-refresh token if needed
      const token = await refreshAccountToken(account);
      if (!token) return null;
      
      if (account.provider === "github") {
        return { provider: "github", data: await new GitHubService(token).fetchContributions() };
      } else if (account.provider === "gitlab") {
        const instanceUrl = account.instance_url || "https://gitlab.com";
        return { provider: "gitlab", data: await new GitLabService(token, user.name || "", instanceUrl).fetchContributions() };
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    
    let githubData: Record<string, number> = {};
    let gitlabData: Record<string, number> = {};

    results.forEach(res => {
      if (!res) return;
      if (res.provider === "github") githubData = res.data;
      if (res.provider === "gitlab") gitlabData = res.data;
    });

    const svg = generateSVG(
      githubData,
      gitlabData,
      { theme: resolvedTheme, weeks, cellSize, layout, title, hideWatermark, timezone, animation: requestedAnim },
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
