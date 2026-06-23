import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser, getActiveSubscription } from "./app/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      isPro: boolean;
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
          session.user.isPro = !!sub;
        } catch {
          session.user.isPro = false;
        }
      } else {
        session.user.isPro = false;
      }
      return session;
    },
  },
});
