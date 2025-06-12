import axiosClient from "./axios";
import prisma from "@/lib/prisma";
import { v4 } from "uuid";

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

      const userSaved = await prisma.user.create({
        data: {
          ...user,
          username,
        },
      }) as User;


      if (userSaved) {
        const keys = ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Q', 'S', 'D', 'F', 'G', 'H'];
        for (let i = 0; i < keys.length; i++) {
          await prisma.userKeyBinding.create({
            data: {
              userId: userSaved.id,
              padPosition: i,
              keyBinding: keys[i],
              createdAt: new Date(),
            },
          }) as UserKeyBinding;
        }

        const project = await prisma.project.create({
          data: {
            name: "One More Time",
            description: "A default project to help you get started. Explore, customize, and play your own beats!",
            isPublic: false,
            userId: userSaved.id,
            uuid: v4()
          }
        });

        const padSounds = [
          "01.wav",
          "02.wav",
          "03.wav",
          "VOICE_01.wav",
          "VOICE_02.wav",
          "VOICE_03.wav",
          "VOICE_04.wav",
          "VOICE_05.wav",
          "VOICE_06.wav",
          "VOICE_07.wav",
          "VOICE_08.wav",
          "VOICE_09.wav",
          "VOICE_10.wav",
          "CLOSE HAT.wav",
          "KICK.wav",
          "SHAKERS.wav",
        ]

        for (let i = 0; i < 16; i++) {
          await prisma.pad.create({
            data: {
              keyBinding: keys[i] || null,
              projectUuid: project.uuid,
              url: "https://zi8itvblm2ouiwoh.public.blob.vercel-storage.com/tanso-default-project/" + padSounds[i] || null,
              fileName: padSounds[i] || null,
            },
          });
        }
      }


      return userSaved;
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
