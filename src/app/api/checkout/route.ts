import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json() as {
      items: Array<{ sessionId: string; imageIndex: number }>;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items required" }, { status: 400 });
    }

    // Validate each item
    for (const item of items) {
      const session = getSession(item.sessionId);
      if (!session) {
        return NextResponse.json({ error: `Session ${item.sessionId} not found` }, { status: 404 });
      }
      if (item.imageIndex < 0 || item.imageIndex >= session.imageUrls.length) {
        return NextResponse.json({ error: `Invalid image index ${item.imageIndex}` }, { status: 400 });
      }
      if (session.purchasedIndices.includes(item.imageIndex)) {
        return NextResponse.json(
          { error: `Image ${item.imageIndex + 1} already purchased` },
          { status: 400 }
        );
      }
    }

    // Compact metadata for Stripe's 500-char limit
    const cartItems = items.map((item) => ({
      s: item.sessionId,
      i: item.imageIndex,
    }));

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item, idx) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: "PictaPet Portrait",
            description: `Portrait #${item.imageIndex + 1}`,
          },
          unit_amount: 999,
        },
        quantity: 1,
      })),
      metadata: {
        cartItems: JSON.stringify(cartItems),
      },
      success_url: `${APP_URL}/checkout/success?stripe_session_id={CHECKOUT_SESSION_ID}&sessions=${[...new Set(items.map((item) => item.sessionId))].join(",")}`,
      cancel_url: request.headers.get("referer") || APP_URL,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
