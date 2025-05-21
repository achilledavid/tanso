import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    const keyBindings = await prisma.userKeyBinding.findMany({
      where: {
        userId: parseInt(userId)
      }
    });

    if (!keyBindings) {
      return NextResponse.json({ error: "No key bindings found" }, { status: 404 });
    }

    return NextResponse.json(keyBindings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch key bindings : " + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    const { id, keyBinding, position } = await request.json() as { id: number, keyBinding: string, position: number };


    const conflictingPad = await prisma.userKeyBinding.findFirst({
      where: {
        userId: parseInt(userId),
        keyBinding,
        id: { not: id },
      },
    });

    if (conflictingPad) {
      await prisma.userKeyBinding.update({
        where: { id },
        data: { padPosition: conflictingPad.padPosition },
      });

      await prisma.userKeyBinding.update({
        where: { id: conflictingPad.id },
        data: { padPosition: position },
      });
    } else {
      await prisma.userKeyBinding.update({
        where: { id },
        data: { keyBinding },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update key bindings: " + error },
      { status: 500 }
    );
  }
}