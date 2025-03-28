import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: number;
      username: string;
      email: string;
      name?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    username?: string;
    email?: string;
    accessToken?: string;
  }
}
