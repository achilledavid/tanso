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

      const pads = await prisma.pad.findMany({
        where: {
          projectUuid: uuid,
          project: {
            userId: user.id,
          },
        },
        orderBy: {
          id: "asc",
        },
      });

      if (!pads) {
        return NextResponse.json(
          { error: "This project does not exist" },
          { status: 404 }
        );
      }

      return NextResponse.json(pads);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch pads : " + error },
        { status: 500 }
      );
    }
  });
}
