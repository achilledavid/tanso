import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "./user";

const prisma = new PrismaClient();

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
        const profile = {
          email: user.email,
          name: user.name,
          image: user.image,
        };

        await upsertUser(profile);
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true
            }
          });

          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.username = dbUser.username;
            session.user.name = dbUser.name || undefined;
            session.user.avatarUrl = dbUser.avatarUrl || undefined;
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
}; 