import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projects = await prisma.project.findMany({
      where: {
        userId: parseInt(id)
      },
      include: {
        AccessAuthorized: {
          select: {
            userEmail: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!projects) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects : " + error },
      { status: 500 }
    );
  }
}