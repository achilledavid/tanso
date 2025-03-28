import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "./user";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const profile: UpsertUserPayload = {
          email: user.email,
          firstname: user.name?.split(" ")[0],
          lastname: user.name?.split(" ")[1],
          avatarUrl: user.image || undefined,
        };

        await upsertUser(profile);
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          session.user = await prisma.user.findUnique({
            where: { email: session.user.email },
          }) as User;
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    },
  },
  pages: {
    error: "/error",
  },
};
