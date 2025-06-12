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
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const isOwner = project.userId === userId;

    // Check if user has shared access using the correct fields from the schema
    const accessAuthorization = await prisma.accessAuthorized.findFirst({
      where: {
        userEmail: userEmail,
        projectUuid: projectUuid,
      },
    });

    const hasAccess = !!accessAuthorization;
    const isPublic = project.isPublic;

    // Check if user has any access to this project
    if (!isOwner && !hasAccess && !isPublic) {
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
      // Shared users get full access (can be modified to READ_ACCESS if needed)
      liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);
    } else if (isPublic) {
      // Public projects get read access with presence
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
