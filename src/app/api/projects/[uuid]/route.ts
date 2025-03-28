import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { uuid } = await params;

      const project = await prisma.project.findUnique({
        where: {
          uuid: uuid,
          userId: user.id,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "This project does not exist" },
          { status: 404 }
        );
      }

      return NextResponse.json(project);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch project : " + error },
        { status: 500 }
      );
    }
  });
}

export function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { uuid } = await params;

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
  });
}
