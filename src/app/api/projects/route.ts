import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { name } = (await req.json()) as { name: string };
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        userId: user.id,
        uuid: uuidv4(),
      },
    });

    const pads = [];
    for (let i = 0; i < 16; i++) {
      pads.push(
        tx.pad.create({
          data: {
            projectUuid: project.uuid,
          },
        })
      );
    }

    await Promise.all(pads);

    return NextResponse.json(project, { status: 201 });
  });
}
