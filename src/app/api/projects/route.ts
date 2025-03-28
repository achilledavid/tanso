import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { withAuth } from "@/lib/middleware";

export function POST(req: NextRequest) {
  return withAuth(req, async (request, user) => {
    try {
      const { name } = (await request.json()) as { name: string };

      if (!user.id) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      return prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
          data: {
            name,
            userId: user.id as number,
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
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create project: " + error },
        { status: 500 }
      );
    }
  });
}
