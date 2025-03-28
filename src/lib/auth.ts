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
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
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
    async jwt({ token, user, account }) {
      if (user) {
        try {
          const dbUser = (await prisma.user.findUnique({
            where: { email: user.email || "" },
          })) as User;

          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            token.email = dbUser.email;

            if (account) {
              token.accessToken =
                account.access_token || account.id_token || token.sub;
            } else if (!token.accessToken) {
              token.accessToken = token.sub;
            }
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      const user = {
        id: token.id as number,
        username: token.username as string,
        email: token.email as string,
        name: token.name as string,
      };

      session.user = user;
      session.accessToken = (token.accessToken as string) || token.sub;

      return session;
    },
  },
  pages: {
    error: "/error",
    signIn: "/login",
  },
};

export function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;

  const sessionStr = localStorage.getItem("next-auth.session-token");
  if (!sessionStr) return null;

  try {
    return sessionStr;
  } catch (e) {
    console.error("Error parsing session from storage:", e);
    return null;
  }
}
