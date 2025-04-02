import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    const { uuid: projectUuid } = await params;
    const { id, startAt, duration } = await request.json() as { id: number, startAt: number, duration: number };

    const pad = await prisma.pad.update({
      where: {
        id,
        projectUuid
      },
      data: {
        startAt,
        duration
      }
    });

    return NextResponse.json(pad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pad sprite : " + error },
      { status: 500 }
    );
  }
}
