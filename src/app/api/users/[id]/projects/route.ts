import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { id } = await params;

      // Only allow users to get their own projects
      if (user.id !== parseInt(id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const projects = await prisma.project.findMany({
        where: {
          userId: parseInt(id),
        },
      });

      if (!projects) {
        return NextResponse.json(
          { error: "No projects found" },
          { status: 404 }
        );
      }

      return NextResponse.json(projects);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch projects : " + error },
        { status: 500 }
      );
    }
  });
}
