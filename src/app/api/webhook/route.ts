import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markSessionPurchased } from "@/lib/session";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const sessionId = checkoutSession.metadata?.sessionId;

    if (sessionId) {
      markSessionPurchased(sessionId, checkoutSession.id);
      console.log(`Session ${sessionId} marked as purchased`);
    }
  }

  return NextResponse.json({ received: true });
}
