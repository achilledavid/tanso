import { Liveblocks } from "@liveblocks/node";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { room } = await request.json();

    if (!room) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Extract project UUID from room ID (format: "project-{uuid}")
    const projectUuid = room.replace("project-", "");

    // Get project basic info
    const project = await prisma.project.findUnique({
      where: { uuid: projectUuid },
      include: {
        user: true,
        AccessAuthorized: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const isOwner = project.userId === userId;

    // Check if user has shared access
    const hasAccess = project.AccessAuthorized.some((access) =>
      access.userEmail.toLowerCase() === userEmail.toLowerCase()
    );

    const isPublic = project.isPublic;

    // Pour les sessions live, permettre l'accès à tous les utilisateurs connectés
    // même si le projet est privé (ils seront en mode spectateur)
    const canAccessLive = true; // Tous les utilisateurs connectés peuvent voir les lives

    // Check if user has any access to this project
    if (!isOwner && !hasAccess && !isPublic && !canAccessLive) {
      return NextResponse.json(
        { error: "Access denied to this project" },
        { status: 403 }
      );
    }

    // Start an auth session with the current user
    const liveblocksSession = liveblocks.prepareSession(userId.toString(), {
      userInfo: {
        name: session.user.username || session.user.email || "Anonymous",
        email: session.user.email || "",
        avatar: session.user.avatarUrl || "",
        isCreator: isOwner,
      },
    });

    // Grant permissions based on user role
    if (isOwner) {
      // Owner gets full access to their project
      liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
    } else if (hasAccess) {
      // Shared users get full access
      liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
    } else {
      // Pour les spectateurs live et projets publics, donner accès en lecture avec présence
      // Cela permet de voir les autres utilisateurs et de recevoir les événements
      liveblocksSession.allow(room, liveblocksSession.READ_ACCESS);
    }

    // Authorize the user and return the result
    const { status, body } = await liveblocksSession.authorize();
    return new Response(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
