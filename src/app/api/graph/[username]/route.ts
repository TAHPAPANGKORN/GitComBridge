import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { decrypt } from "@/lib/utils/encryption";
import { generateSVG } from "@/lib/utils/svg-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const searchParams = request.nextUrl.searchParams;
  const theme = (searchParams.get("theme") as "dark" | "light") || "dark";

  // --- SPECIAL CASE: DEMO DATA ---
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

    const svg = generateSVG(mockGithub, mockGitlab, theme);
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
      include: { accounts: true },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

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

    const svg = generateSVG(githubData, gitlabData, theme);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Graph Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
