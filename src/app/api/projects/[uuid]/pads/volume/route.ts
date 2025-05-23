import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    const { uuid: projectUuid } = await params;
    const { id, volume } = await request.json() as { id: number, volume: number };

    const pad = await prisma.pad.update({
      where: {
        id,
        projectUuid
      },
      data: {
        volume
      }
    });

    return NextResponse.json(pad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pad volume : " + error },
      { status: 500 }
    );
  }
}
