import axios from "axios";
import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "./encryption";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

/**
 * Refreshes an OAuth token for a given account if it's expired or about to expire.
 * @param account The account object from Prisma
 * @returns The new access token (decrypted)
 */
export async function refreshAccountToken(account: any): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  
  // 🛡️ Safety: If we have a fresh plaintext access_token (just updated by NextAuth), use it!
  if (account.access_token && !account.access_token.includes(":")) {
     return account.access_token;
  }

  // If we have an expiration time and it hasn't expired yet (with 5 min buffer), return current token
  if (account.expires_at && account.expires_at > now + 300) {
    const rawToken = account.encrypted_access_token || account.access_token;
    return rawToken ? decrypt(rawToken) : null;
  }

  // If no refresh token, we can't refresh
  const rawRefreshToken = account.encrypted_refresh_token || account.refresh_token;
  if (!rawRefreshToken) {
    const rawToken = account.encrypted_access_token || account.access_token;
    return rawToken ? decrypt(rawToken) : null;
  }

  const refreshToken = decrypt(rawRefreshToken);

  try {
    let tokenUrl = "";
    let clientId = "";
    let clientSecret = "";

    if (account.provider === "gitlab") {
      const instanceUrl = account.instance_url || "https://gitlab.com";
      tokenUrl = `${instanceUrl.replace(/\/$/, "")}/oauth/token`;
      clientId = process.env.GITLAB_ID || "";
      clientSecret = process.env.GITLAB_SECRET || "";
    } else if (account.provider === "github") {
      tokenUrl = "https://github.com/login/oauth/access_token";
      clientId = process.env.GITHUB_ID || "";
      clientSecret = process.env.GITHUB_SECRET || "";
    } else {
      return null;
    }

    const response = await axios.post(tokenUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }, {
      headers: { Accept: "application/json" }
    });

    const { access_token, refresh_token, expires_in } = response.data;

    if (!access_token) throw new Error("No access token in refresh response");

    // Encrypt new tokens
    const encryptedAccessToken = encrypt(access_token, ENCRYPTION_KEY);
    const encryptedRefreshToken = refresh_token ? encrypt(refresh_token, ENCRYPTION_KEY) : null;
    const expiresAt = expires_in ? Math.floor(Date.now() / 1000) + expires_in : null;

    // Update DB
    await prisma.account.update({
      where: { id: account.id },
      data: {
        encrypted_access_token: encryptedAccessToken,
        encrypted_refresh_token: encryptedRefreshToken,
        expires_at: expiresAt,
        access_token: null, // Clear plaintext
        refresh_token: null, // Clear plaintext
      }
    });

    return access_token;
  } catch (error: any) {
    console.error(`Failed to refresh ${account.provider} token:`, error.response?.data || error.message);
    // Return old token as last resort (might still work if expires_at was missing)
    const rawToken = account.encrypted_access_token || account.access_token;
    return rawToken ? decrypt(rawToken) : null;
  }
}
