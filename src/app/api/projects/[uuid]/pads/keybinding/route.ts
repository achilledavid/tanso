import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    const { uuid: projectUuid } = await params;
    const { id, keyBinding } = await request.json() as { id: number, keyBinding: string | null };

    const pad = await prisma.pad.update({
      where: {
        id,
        projectUuid
      },
      data: {
        keyBinding
      }
    });

    return NextResponse.json(pad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pad key binding : " + error },
      { status: 500 }
    );
  }
}
