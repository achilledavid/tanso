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
    async session({ session }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;

      if (extendedSession.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: extendedSession.user.email },
          });

          if (dbUser) {
            extendedSession.user.id = dbUser.id;
            extendedSession.user.name = dbUser.username;
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return extendedSession;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
}; 