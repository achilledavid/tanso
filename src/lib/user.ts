import axiosClient from "./axios";
import prisma from "@/lib/prisma";

export async function upsertUser(user: UpsertUserPayload): Promise<User | null> {
  if (!user.email) return null;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) return existingUser as User;

    else {
      let username = user.email.split("@")[0];

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
          ...user,
          username,
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

export async function deleteUser(id: number): Promise<void> {
  await axiosClient.delete(`/api/users/${id}`);
}

export async function updateUser(id: number, data: UpdateUserPayload): Promise<User> {
  const response = await axiosClient.put(`/api/users/${id}`, data);
  return response.data;
}
