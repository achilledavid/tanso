import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { uuid: projectUuid } = await params;
      const { id, isLooped } = (await req.json()) as {
        id: number;
        isLooped: boolean;
      };

      const pad = await prisma.pad.update({
        where: {
          id,
          projectUuid,
          project: {
            userId: user.id,
          },
        },
        data: {
          isLooped,
        },
      });

      return NextResponse.json(pad);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update pad loop : " + error },
        { status: 500 }
      );
    }
  });
}
