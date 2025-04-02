import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid: projectUuid } = await params;
    const { id } = await request.json() as { id: number };

    if (!id) {
      return NextResponse.json(
        { error: "Pad id is required" },
        { status: 400 }
      );
    }

    const pad = await prisma.pad.update({
      where: {
        id,
        projectUuid
      },
      data: {
        url: null,
        fileName: null,
        isLooped: false,
        startAt: 0,
        duration: 0
      }
    });

    return NextResponse.json(pad);

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to remove file from pad: ${error}` },
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
    const { url, id, path } = (await request.json()) as {
      url: string;
      id: number;
      path: string;
    };

    const pad = await prisma.pad.update({
      where: {
        id: id,
        projectUuid: uuid,
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
}
