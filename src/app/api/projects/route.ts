import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendProjectSharedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, description, collaborators, sounds, isPublic, userId } = (await req.json()) as { name: string, description: string, collaborators: string[], sounds: { url: string, fileName: string }[], isPublic?: boolean, userId: number };

  const keyBindings = await prisma.userKeyBinding.findMany({
    where: {
      userId
    }
  });

  keyBindings.sort((a, b) => a.padPosition - b.padPosition);

  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        description,
        userId,
        uuid: uuidv4(),
        isPublic: isPublic ?? false,
      },
    });

    const pads = [];
    for (let i = 0; i < 16; i++) {
      pads.push(
        tx.pad.create({
          data: {
            keyBinding: keyBindings[i]?.keyBinding ?? null,
            projectUuid: project.uuid,
            url: sounds[i]?.url || null,
            fileName: sounds[i]?.fileName || null,
          },
        })
      );
    }

    const user = await tx.user.findUnique({
      where: { id: userId }
    });

    if (!user) return

    await Promise.all(pads);

    if (collaborators && collaborators.length > 0) {
      const collaboratorPromises = collaborators.map(async (email) => {
        const normalizedEmail = email.toLowerCase();

        await tx.accessAuthorized.create({
          data: {
            userEmail: normalizedEmail,
            projectUuid: project.uuid,
          },
        });

        const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/projects/${project.uuid}`;
        await sendProjectSharedEmail({
          toEmail: normalizedEmail,
          projectName: name,
          projectUrl,
          fromUserName: user.username || user.firstname || user.email,
        });
      });

      await Promise.all(collaboratorPromises);
    }

    return NextResponse.json(project, { status: 201 });
  });
}
