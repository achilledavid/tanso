import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const { uuid: projectUuid } = params;
    const { id, reverb } = await request.json() as { id: number, reverb: number };

    const pad = await prisma.pad.update({
      where: {
        id,
        projectUuid
      },
      data: {
        reverb
      }
    });
    return NextResponse.json(pad);
  } catch (error) {
    console.error("Error updating pad reverb:", error);
    return NextResponse.json(
      { error: "Failed to update pad reverb: An unexpected error occurred." },
      { status: 500 }
    );
  }
}
