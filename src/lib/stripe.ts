import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
  typescript: true,
});

/** Theme access control — Server-side only, never expose to client */
export const THEME_TIER: Record<string, "free" | "pro"> = {
  // Free Themes
  dark:    "free",
  light:   "free",
  // Pro Dark Themes
  ocean:   "pro",
  sunset:  "pro",
  neon:    "pro",
  monokai: "pro",
  matcha:  "pro",
  // Pro Light Themes 
  sakura:  "pro",
  snow:    "pro",
  daydream:  "pro",
  latte: "pro",
  ruby: "pro",
};

/** Verify if a user has access to a given theme */
export function hasThemeAccess(
  theme: string,
  userTier: "free" | "pro"
): boolean {
  const required = THEME_TIER[theme] ?? "pro"; // unknown themes → pro only
  if (required === "free") return true;
  return userTier === "pro";
}
