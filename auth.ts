import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser, getActiveSubscription } from "./app/lib/db";

export type PlanTier = "free" | "pro" | "ai_pro";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      isPro: boolean;
      plan: PlanTier;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        const user = await findOrCreateUser({
          email: profile.email,
          name: (profile.name as string) ?? profile.email.split("@")[0],
          image: profile.picture as string | undefined,
        });
        token.userId = user.id;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
        try {
          const sub = await getActiveSubscription(token.userId as string);
          if (sub) {
            const aiVariantId = process.env.LEMONSQUEEZY_AI_VARIANT_ID;
            const isAiPro = aiVariantId && String(sub.ls_variant_id) === aiVariantId;
            session.user.isPro = true;
            session.user.plan = isAiPro ? "ai_pro" : "pro";
          } else {
            session.user.isPro = false;
            session.user.plan = "free";
          }
        } catch {
          session.user.isPro = false;
          session.user.plan = "free";
        }
      } else {
        session.user.isPro = false;
        session.user.plan = "free";
      }
      return session;
    },
  },
});
