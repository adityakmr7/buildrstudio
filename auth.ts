import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser, getActiveSubscription } from "./app/lib/db";
import { sendWelcomeEmail } from "./app/lib/email";

export type PlanTier = "free" | "pro" | "lifetime";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      isPro: boolean;
      plan: PlanTier;
      isNewUser?: boolean;
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
        const isNew = !(await import("./app/lib/db").then(m => m.findUserByEmail(profile.email!)));
        const user = await findOrCreateUser({
          email: profile.email,
          name: (profile.name as string) ?? profile.email.split("@")[0],
          image: profile.picture as string | undefined,
        });
        token.userId = user.id;
        token.picture = user.image;
        token.isNewUser = isNew;
        if (isNew) {
          sendWelcomeEmail(user.email, user.name ?? "").catch(() => {});
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.isNewUser = (token.isNewUser as boolean) ?? false;
        try {
          const sub = await getActiveSubscription(token.userId as string);
          if (sub) {
            session.user.isPro = true;
            session.user.plan = sub.status === "lifetime" ? "lifetime" : "pro";
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
