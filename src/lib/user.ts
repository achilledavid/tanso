import axiosClient from "./axios";
import prisma from "@/lib/prisma";

export async function upsertUser(profile: { email: string; name?: string | null; image?: string | null; }): Promise<User | null> {
  if (!profile.email) return null;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) return existingUser as User;
    else {
      let username = profile.name?.replace(/\s+/g, "").toLowerCase() || profile.email.split("@")[0];

      let usernameExists = await prisma.user.findUnique({
        where: { username },
      });

      let suffix = 1;

      while (usernameExists) {
        username = `${username}${suffix}`;
        usernameExists = await prisma.user.findUnique({
          where: { username },
        });
        suffix++;
      }

      return await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          username,
          avatarUrl: profile.image,
        },
      }) as User;
    }
  } catch (error) {
    console.error("Error managing user:", error);
    return null;
  }
}

export async function getProjectsByUserId(id: number): Promise<Project[]> {
  const response = await axiosClient.get(`/api/users/${id}/projects`);
  return response.data;
}

export async function getUser(id: number): Promise<User> {
  const response = await axiosClient.get(`/api/users/${id}`)
  return response.data;
}
