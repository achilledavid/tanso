import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
  static async upsertUser(profile: {
    email: string;
    name?: string | null;
    image?: string | null;
    sub: string;
  }): Promise<User | null> {
    if (!profile.email) return null;

    const username =
      profile.name?.replace(/\s+/g, "").toLowerCase() ||
      profile.email.split("@")[0];

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (existingUser) {
        return existingUser;
      } else {
        return await prisma.user.create({
          data: {
            email: profile.email,
            username,
            avatarUrl: profile.image,
            auth0Id: profile.sub,
            profile: {
              create: {},
            },
          },
        });
      }
    } catch (error) {
      console.error("Error managing user:", error);
      return null;
    }
  }
}
