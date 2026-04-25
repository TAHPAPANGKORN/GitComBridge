import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

// IMPORTANT: Disable body parsing — Stripe needs raw bytes for signature verification
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text(); // Raw body for HMAC verification
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // 🔐 HMAC-SHA256 signature verification — rejects any non-Stripe requests
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId in checkout session metadata");
          break;
        }

        // Payment successful → upgrade to Pro
        await prisma.user.update({
          where: { id: userId },
          data: {
            tier: "pro",
            stripePaymentId: session.payment_intent as string,
            tierActivatedAt: new Date(),
          },
        });

        console.log(`✅ User ${userId} upgraded to Pro`);
        break;
      }

      default:
        // Ignore other events silently
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
