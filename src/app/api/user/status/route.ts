import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    if (!userId) {
      console.error("❌ No userId found in session");
      return NextResponse.json({ error: "No userId in session" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tier: true,
        accounts: { select: { provider: true } },
      },
    });

    const providers = (user?.accounts ?? []).map((acc: any) => acc.provider);

    return NextResponse.json({
      github: providers.includes("github"),
      gitlab: providers.includes("gitlab"),
      tier: (user?.tier ?? "free") as "free" | "pro",
    });
  } catch (error: any) {
    console.error("❌ User Status API Error:", error.message || error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error.message 
    }, { status: 500 });
  }
}
