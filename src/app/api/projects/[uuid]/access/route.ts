import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { uuid },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Only the owner can view access list" }, { status: 403 });
    }

    const access = await prisma.accessAuthorized.findMany({
      where: { projectUuid: uuid },
      include: {
        user: true,
      },
    });

    return NextResponse.json(access);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project access : " + error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    const project = await prisma.project.findUnique({
      where: { uuid },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Only the owner can add access" }, { status: 403 });
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (userToAdd && userToAdd.id === project.userId) {
      return NextResponse.json({ error: "Owner already has access" }, { status: 400 });
    }

    try {
      const existingAccess = await prisma.accessAuthorized.findFirst({
        where: {
          userEmail: email.toLowerCase(),
          projectUuid: uuid,
        },
        include: {
          user: true,
        },
      });
      
      let access;
      
      if (existingAccess) {
        access = existingAccess;
      } else {
        access = await prisma.accessAuthorized.create({
          data: {
            userEmail: email.toLowerCase(),
            projectUuid: uuid,
          },
          include: {
            user: true,
          },
        });
      }

      return NextResponse.json(access);
    } catch (error) {
      console.error("Prisma error adding access:", error);
      return NextResponse.json(
        { error: `Database error: ${error}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error adding project access:", error);
    return NextResponse.json(
      { error: "Failed to add project access : " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userEmail } = await request.json();

    const project = await prisma.project.findUnique({
      where: { uuid },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Only the owner can remove access" }, { status: 403 });
    }

    await prisma.accessAuthorized.deleteMany({
      where: {
        userEmail: userEmail,
        projectUuid: uuid,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing access:", error);
    return NextResponse.json(
      { error: "Failed to remove project access : " + error },
      { status: 500 }
    );
  }
}
