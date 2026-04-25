import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GitLabProvider from "next-auth/providers/gitlab";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/utils/encryption";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: { params: { scope: "read:user" } },
      allowDangerousEmailAccountLinking: true,
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_ID || "",
      clientSecret: process.env.GITLAB_SECRET || "",
      authorization: { params: { scope: "read_api" } },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ account }) {
      try {
        if (account.access_token && (ENCRYPTION_KEY.length === 32 || ENCRYPTION_KEY.length === 64)) {
          const encryptedAccessToken = encrypt(account.access_token, ENCRYPTION_KEY);
          const encryptedRefreshToken = account.refresh_token 
            ? encrypt(account.refresh_token, ENCRYPTION_KEY) 
            : null;

          await prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            data: {
              encrypted_access_token: encryptedAccessToken,
              encrypted_refresh_token: encryptedRefreshToken,
            },
          });
        }
      } catch (error) {
        console.error("Error in linkAccount event:", error);
      }
    },
  },
};
