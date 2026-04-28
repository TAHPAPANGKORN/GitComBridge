import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GitHubService } from "@/lib/services/github.service";
import { GitLabService } from "@/lib/services/gitlab.service";
import { refreshAccountToken } from "@/lib/utils/token-refresher";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const searchParams = request.nextUrl.searchParams;
  const weeks = parseInt(searchParams.get("weeks") || "20");

  // --- SPECIAL CASE: DEMO DATA ---
  if (decodedUsername === "demo") {
    const mockContributions: Record<string, any> = {};
    const now = new Date();
    for (let i = 0; i < (weeks * 7); i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const rand = Math.random();
      if (rand > 0.7) {
        const gh = Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0;
        const gl = Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0;
        if (gh > 0 || gl > 0) {
          mockContributions[dateStr] = { github: gh, gitlab: gl, total: gh + gl };
        } else {
          mockContributions[dateStr] = { github: 0, gitlab: 0, total: 0 };
        }
      } else {
        mockContributions[dateStr] = { github: 0, gitlab: 0, total: 0 };
      }
    }
    
    return NextResponse.json({
      username: "Demo User",
      tier: "pro",
      stats: { totalCommits: 452, currentStreak: 12, maxStreak: 34 },
      contributions: mockContributions,
      updatedAt: new Date().toISOString()
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { name: decodedUsername },
      select: { id: true, name: true, tier: true, accounts: true },
    });

    if (!user) return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });

    const fetchPromises = user.accounts.map(async (account: any) => {
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

    // Merge and calculate stats
    const allDates = new Set([...Object.keys(githubData), ...Object.keys(gitlabData)]);
    const sortedDates = Array.from(allDates).sort();
    
    let totalCommits = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const today = format(new Date(), "yyyy-MM-dd");

    sortedDates.forEach(date => {
      const gh = githubData[date] || 0;
      const gl = gitlabData[date] || 0;
      const total = gh + gl;
      totalCommits += total;
      
      if (total > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    for (let i = 0; i < sortedDates.length; i++) {
        const d = sortedDates[sortedDates.length - 1 - i];
        if ((githubData[d] || 0) + (gitlabData[d] || 0) > 0) currentStreak++;
        else if (d !== today) break;
    }

    // Filter for requested weeks
    const now = new Date();
    const startDate = subDays(now, (weeks * 7) - 1);
    const calendarStart = startOfWeek(startDate);
    const daysInterval = eachDayOfInterval({ start: calendarStart, end: now });
    
    const filteredContributions: Record<string, any> = {};
    daysInterval.forEach(day => {
      const d = format(day, "yyyy-MM-dd");
      const gh = githubData[d] || 0;
      const gl = gitlabData[d] || 0;
      filteredContributions[d] = { github: gh, gitlab: gl, total: gh + gl };
    });

    return NextResponse.json({
      username: user.name,
      tier: user.tier,
      stats: { totalCommits, currentStreak, maxStreak },
      contributions: filteredContributions,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Widget API Error:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
