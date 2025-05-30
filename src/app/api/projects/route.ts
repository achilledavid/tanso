import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { sendProjectSharedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, description, collaborators, sounds, isPublic  } = (await req.json()) as { name: string, description: string, collaborators: string[], sounds: {url: string, fileName: string}[], isPublic?: boolean };
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyBindings = await prisma.userKeyBinding.findMany({
    where: {
      userId: user.id
    }
  });


  keyBindings.sort((a, b) => a.padPosition - b.padPosition);

  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        description,
        userId: user.id,
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
