import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const pads = await prisma.pad.findMany({
      where: {
        projectUuid: uuid,
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
}
