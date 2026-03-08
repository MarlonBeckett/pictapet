import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.purchased) {
      return NextResponse.json({ error: "Already purchased" }, { status: 400 });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "PictaPet Portrait Package",
              description: `${session.imageUrls.length} high-resolution pet portrait(s) — watermark-free`,
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      metadata: { sessionId },
      success_url: `${APP_URL}/result/${sessionId}?purchased=true`,
      cancel_url: `${APP_URL}/result/${sessionId}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
