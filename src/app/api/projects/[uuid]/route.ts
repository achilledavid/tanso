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

    const project = await prisma.project.findUnique({
      where: {
        uuid: uuid,
      },
      include: {
        Pads: true,
        AccessAuthorized: true
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "This project does not exist" },
        { status: 404 }
      );
    }

    const isPublic = typeof project.isPublic === 'boolean' ? project.isPublic : false;

    const isOwner = user?.id === project.userId;
    const isEditor = user ? project.AccessAuthorized.some(access =>
      access.userEmail.toLowerCase() === user.email.toLowerCase()
    ) : false;

    if (!isPublic && !isOwner && !isEditor && user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isPublic && !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectWithPermissions = {
      ...project,
      permissions: {
        isOwner,
        isEditor,
        canEdit: isOwner || isEditor,
        canDelete: isOwner,
        canRename: isOwner
      }
    };

    if (isPublic && !isOwner && !isEditor) {
      return NextResponse.json({
        ...project,
        permissions: {
          isOwner: false,
          isEditor: false,
          canEdit: false,
          canDelete: false,
          canRename: false
        }
      });
    }

    return NextResponse.json(projectWithPermissions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project : " + error },
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

    const project = await prisma.project.findUnique({
      where: { uuid }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Only the owner can delete this project" }, { status: 403 });
    }

    await prisma.project.delete({
      where: {
        uuid: uuid,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project : " + error },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();

    const project = await prisma.project.findUnique({
      where: { uuid },
      include: { AccessAuthorized: true }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.userId === user.id;
    const isEditor = project.AccessAuthorized.some(access =>
      access.userEmail.toLowerCase() === user.email.toLowerCase()
    );

    if (body.hasOwnProperty('name') && !isOwner) {
      return NextResponse.json({ error: "Only the owner can rename the project" }, { status: 403 });
    }

    if (body.hasOwnProperty('isPublic') && !isOwner) {
      return NextResponse.json({ error: "Only the owner can change project visibility" }, { status: 403 });
    }

    if (!isOwner && !isEditor) {
      return NextResponse.json({ error: "You don't have permission to modify this project" }, { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: {
        uuid: uuid,
      },
      data: body,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project: " + error },
      { status: 500 }
    );
  }
}
