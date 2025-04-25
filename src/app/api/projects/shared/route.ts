import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sharedProjects = await prisma.project.findMany({
      where: {
        AccessAuthorized: {
          some: {
            userEmail: user.email
          }
        }
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(sharedProjects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shared projects : " + error },
      { status: 500 }
    );
  }
}
