import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

function initLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("Missing LEMONSQUEEZY_API_KEY");
  lemonSqueezySetup({ apiKey });
}

export async function createCheckoutUrl(params: {
  userId: string;
  userEmail: string;
  userName: string;
  plan?: "pro" | "ai_pro";
}): Promise<string> {
  initLemonSqueezy();

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = params.plan === "ai_pro"
    ? process.env.LEMONSQUEEZY_AI_VARIANT_ID
    : process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!storeId || !variantId) {
    throw new Error("Missing LEMONSQUEEZY_STORE_ID or variant ID");
  }

  const checkout = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: params.userEmail,
      name: params.userName,
      custom: {
        user_id: params.userId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://buildrstudio.in"}/screenshot-builder?upgraded=true`,
    },
  });

  const url = checkout.data?.data?.attributes?.url;
  if (!url) throw new Error("Failed to create checkout URL");

  return url;
}

export async function getLsSubscription(subscriptionId: string) {
  initLemonSqueezy();
  const sub = await getSubscription(subscriptionId);
  return sub.data;
}
