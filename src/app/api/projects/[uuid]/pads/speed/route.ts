import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const { uuid: projectUuid } = params;
    const { id, speed } = await request.json() as { id: number, speed: number };

    const pad = await prisma.pad.update({
      where: {
        id,
        projectUuid
      },
      data: {
        speed
      }
    });
    return NextResponse.json(pad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pad speed: An unexpected error occurred." + error },
      { status: 500 }
    );
  }
}
