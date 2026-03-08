import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markImagesPurchased } from "@/lib/session";
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
    const cartItemsStr = checkoutSession.metadata?.cartItems;

    if (cartItemsStr) {
      try {
        const cartItems = JSON.parse(cartItemsStr) as Array<{ s: string; i: number }>;

        // Group by sessionId
        const grouped = new Map<string, number[]>();
        for (const item of cartItems) {
          const existing = grouped.get(item.s) || [];
          existing.push(item.i);
          grouped.set(item.s, existing);
        }

        for (const [sessionId, indices] of grouped) {
          await markImagesPurchased(sessionId, indices, checkoutSession.id);
          console.log(`Session ${sessionId}: marked images [${indices.join(",")}] as purchased`);
        }
      } catch (err) {
        console.error("Failed to parse cartItems metadata:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
