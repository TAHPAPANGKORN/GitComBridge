import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const BASE_URL = process.env.NEXTAUTH_URL || "https://gitcombrigde.vercel.app";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, tier: true, stripeCustomerId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Already Pro → don't let them pay again
    if (user.tier === "pro") {
      return NextResponse.json({ error: "Already Pro" }, { status: 400 });
    }

    // Reuse existing Stripe Customer or create new one
    let customerId: string | null = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create one-time Checkout Session (350 THB ~ $9.99)
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card", "promptpay"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: "GitComBridge Pro Lifetime Access",
              description: "Unlock all premium themes, layouts, and custom sizes forever.",
            },
            unit_amount: 35000, // 350.00 THB
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/canceled`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error.message || error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message,
        hint: !process.env.STRIPE_SECRET_KEY ? "Missing STRIPE_SECRET_KEY" : "Check DB connection"
      }, 
      { status: 500 }
    );
  }
}
