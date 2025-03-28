import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { uuid: projectUuid } = await params;
      const { id } = (await req.json()) as { id: number };

      if (!id) {
        return NextResponse.json(
          { error: "Pad id is required" },
          { status: 400 }
        );
      }

      const pad = await prisma.pad.update({
        where: {
          id,
          projectUuid,
          project: {
            userId: user.id,
          },
        },
        data: {
          url: null,
          fileName: null,
        },
      });

      return NextResponse.json(pad);
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to remove file from pad: ${error}` },
        { status: 500 }
      );
    }
  });
}

export function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { uuid } = await params;
      const { url, id, path } = (await req.json()) as {
        url: string;
        id: number;
        path: string;
      };

      const pad = await prisma.pad.update({
        where: {
          id: id,
          projectUuid: uuid,
          project: {
            userId: user.id,
          },
        },
        data: {
          url,
          fileName: path.split("/").pop(),
        },
      });

      return NextResponse.json(pad);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update pad : " + error },
        { status: 500 }
      );
    }
  });
}
