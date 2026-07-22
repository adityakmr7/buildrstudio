import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY ?? "", {
  environment: Environment.production,
});

export { paddle };

export async function createCheckoutUrl({
  userId,
  userEmail,
  plan,
}: {
  userId: string;
  userEmail?: string | null;
  plan: "pro" | "lifetime";
}): Promise<string> {
  const priceId =
    plan === "lifetime"
      ? process.env.PADDLE_LIFETIME_PRICE_ID!
      : process.env.PADDLE_PRO_PRICE_ID!;

  const transaction = await paddle.transactions.create({
    items: [{ priceId, quantity: 1 }],
    customData: { user_id: userId },
    ...(userEmail ? { customer: { email: userEmail } } : {}),
    checkout: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/?checkout=success`,
    },
  });

  const checkoutUrl = (transaction as { checkout?: { url?: string } }).checkout?.url;
  if (!checkoutUrl) throw new Error("Paddle did not return a checkout URL");
  return checkoutUrl;
}
