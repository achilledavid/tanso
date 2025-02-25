import { PrismaClient } from "@prisma/client";
import { UserService } from "@/lib/services/user.service";
import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedUser {
  id?: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

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
    async signIn({ user, account }) {
      if (user.email) {
        const profileWithSub = {
          email: user.email,
          name: user.name,
          image: user.image,
          sub: account?.providerAccountId || "",
        };

        await UserService.upsertUser(profileWithSub);
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
    signIn: "/auth/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
