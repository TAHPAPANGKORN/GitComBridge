import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { decrypt } from "@/lib/utils/encryption";
import { generateStatsSVG } from "@/lib/utils/stats-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const searchParams = request.nextUrl.searchParams;
  const theme = searchParams.get("theme") || "light";

  try {
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

    // 🔐 PRO ONLY FEATURE
    if (user.tier !== "pro") {
      return new NextResponse("Pro Tier Required", { status: 403 });
    }

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

    const svg = generateStatsSVG(githubData, gitlabData, user.name || "User", theme);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Stats Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
