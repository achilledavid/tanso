import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        sessions: true,
        sounds: true,
        presets: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const body = await request.json();
    const { username, avatarUrl, profile } = body;

    console.log("Received update data:", body); // Log pour debug

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Vérification du nom d'utilisateur seulement s'il est différent de l'actuel
    let updatedUsername = username;
    if (username && username !== existingUser.username) {
      let usernameExists = await prisma.user.findUnique({
        where: {
          username,
          NOT: { id: userId }, // Exclure l'utilisateur actuel
        },
      });

      if (usernameExists) {
        let suffix = 1;
        while (usernameExists) {
          updatedUsername = `${username}${suffix}`;
          usernameExists = await prisma.user.findUnique({
            where: { username: updatedUsername },
          });
          suffix++;
        }
      }
    }

    type UserUpdateData = {
      username?: string;
      avatarUrl?: string | null;
      profile?: {
        update: {
          theme?: string;
          defaultBpm?: number;
          volumeDefault?: number;
          metronomeEnabled?: boolean;
          preferredPadSize?: number;
        };
      };
    };

    const updateData: UserUpdateData = {};

    if (updatedUsername) updateData.username = updatedUsername;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    if (profile) {
      updateData.profile = {
        update: { ...profile },
      };
    }

    console.log("Update data:", updateData); // Log pour debug

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        profile: true,
      },
    });

    console.log("Updated user:", updatedUser); // Log pour debug
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: `Failed to update user: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" + error },
      { status: 500 }
    );
  }
}
