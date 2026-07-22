import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getServerPaddleClient } from "@/app/lib/paddle";
import { getPaddleCustomerByEmail, getPaddleSubscriptionsForCustomer } from "@/app/lib/paddleDb";

// GET (not POST) so this can be a plain link from the account screen — there's
// no client-supplied input at all, which is the point: the only identity this
// route trusts is the server-side session, never anything the client sends.
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));
  }

  const customer = await getPaddleCustomerByEmail(session.user.email);
  if (!customer) {
    // No Paddle customer exists for this email yet — they've never checked
    // out. Send them back to the account screen with a flag to explain why
    // there's no portal to open, rather than erroring.
    return NextResponse.redirect(
      new URL("/account?portal=no_customer", process.env.NEXT_PUBLIC_APP_URL),
    );
  }

  try {
    const subscriptions = await getPaddleSubscriptionsForCustomer(customer.customerId);
    const subscriptionIds = subscriptions.map((s) => s.subscriptionId);

    const client = getServerPaddleClient();
    const portalSession = await client.customerPortalSessions.create(
      customer.customerId,
      subscriptionIds,
    );

    return NextResponse.redirect(portalSession.urls.general.overview);
  } catch (err) {
    console.error("Paddle customer portal: failed to create session", err);
    return NextResponse.redirect(
      new URL("/account?portal=error", process.env.NEXT_PUBLIC_APP_URL),
    );
  }
}
