import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const pads = await prisma.pad.findMany({
      where: {
        projectId: parseInt(id)
      },
      orderBy: {
        id: "asc"
      }
    });

    if (!pads) {
      return NextResponse.json({ error: "This project does not exist" }, { status: 404 });
    }

    return NextResponse.json(pads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pads : " + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { url, id, path } = await request.json() as { url: string, id: number, path: string };

    const pad = await prisma.pad.update({
      where: {
        id: id,
        projectId: parseInt(projectId)
      },
      data: {
        url,
        fileName: path.split("/").pop()
      }
    });

    return NextResponse.json(pad);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pad : " + error },
      { status: 500 }
    );
  }
}