import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    if (!user.username) {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 404 }
      );
    }

    const username = user.username;

    try {
      const formData = await req.formData();
      const files = formData.getAll("file");

      if (!files.length) {
        return NextResponse.json(
          { error: "No files found in the request" },
          { status: 400 }
        );
      }

      const results = await Promise.all(
        files.map(async (file) => {
          if (!(file instanceof File)) {
            return { error: "Invalid file object" };
          }

          const blob = await put(`${username}/${file.name}`, file, {
            access: "public",
          });

          return { ...blob, original: file.name };
        })
      );

      return NextResponse.json({ results });
    } catch (error) {
      console.error("Error processing files:", error);
      return NextResponse.json(
        { error: "Failed to process files" },
        { status: 500 }
      );
    }
  });
}

export function DELETE(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const formData = await req.formData();
      const urls = formData.getAll("url");

      if (!urls.length) {
        return NextResponse.json(
          { error: "At least one URL is required" },
          { status: 400 }
        );
      }

      await Promise.all(
        urls.map(async (url) => {
          if (typeof url !== "string") {
            throw new Error("Invalid URL format");
          }

          await prisma.pad.updateMany({
            where: {
              url,
            },
            data: {
              url: null,
            },
          });

          await del(url);
        })
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting files:", error);
      return NextResponse.json(
        { error: "Failed to delete files" },
        { status: 500 }
      );
    }
  });
}
