import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { generateSVG } from "@/lib/utils/svg-generator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const ghToken = searchParams.get("gh_token");
  const glToken = searchParams.get("gl_token");
  const glUser = searchParams.get("gl_user");
  const glInstance = searchParams.get("gl_instance") || "https://gitlab.com";

  if (!ghToken && !glToken) {
    return new NextResponse("Missing tokens (gh_token or gl_token)", { status: 400 });
  }

  const githubService = new GitHubService(ghToken || "");
  const gitlabService = new GitLabService(glToken || "", glUser || "", glInstance);

  try {
    const [ghData, glData] = await Promise.all([
      githubService.fetchContributions(),
      gitlabService.fetchContributions()
    ]);
    
    const svg = generateSVG(ghData, glData);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating graph:", error);
    return new NextResponse("Error generating graph", { status: 500 });
  }
}
