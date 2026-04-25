import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/utils/encryption";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { generateSVG } from "@/lib/utils/svg-generator";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  try {
    // 1. Find the user by name. We only pick ONE user.
    const user = await prisma.user.findFirst({
      where: { name: username },
      include: { accounts: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // 2. Extract tokens ONLY from this specific user's accounts
    // This ensures only accounts officially linked to this identity are merged.
    let ghToken = "";
    let glToken = "";
    let glUser = "";

    const githubAccount = user.accounts.find((a: any) => a.provider === "github");
    const gitlabAccount = user.accounts.find((a: any) => a.provider === "gitlab");

    if (githubAccount?.encrypted_access_token && (ENCRYPTION_KEY.length === 32 || ENCRYPTION_KEY.length === 64)) {
      ghToken = decrypt(githubAccount.encrypted_access_token, ENCRYPTION_KEY);
    }

    if (gitlabAccount?.encrypted_access_token && (ENCRYPTION_KEY.length === 32 || ENCRYPTION_KEY.length === 64)) {
      glToken = decrypt(gitlabAccount.encrypted_access_token, ENCRYPTION_KEY);
      glUser = gitlabAccount.providerAccountId;
    }

    // 3. Fetch data and generate SVG
    const githubService = new GitHubService(ghToken);
    const gitlabService = new GitLabService(glToken, glUser);

    const [ghData, glData] = await Promise.all([
      ghToken ? githubService.fetchContributions() : Promise.resolve({}),
      glToken ? gitlabService.fetchContributions() : Promise.resolve({})
    ]);

    const svg = generateSVG(ghData, glData);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in secure graph generation:", error);
    return new NextResponse("Error generating graph", { status: 500 });
  }
}
