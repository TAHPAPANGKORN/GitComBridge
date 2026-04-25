import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        accounts: {
          select: {
            provider: true
          }
        }
      }
    });

    const providers = user?.accounts.map((acc: any) => acc.provider) || [];

    return NextResponse.json({
      github: providers.includes("github"),
      gitlab: providers.includes("gitlab")
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
