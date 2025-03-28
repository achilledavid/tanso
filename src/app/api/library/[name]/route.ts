import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { name } = await params;

      // Make sure users can only access their own library
      if (user.username !== name) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const files = await list({
        prefix: `${name}/`,
      });

      files.blobs = files.blobs.sort((a, b) => {
        return (
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        );
      });

      return NextResponse.json({
        files: files.blobs.map((file) => {
          return {
            ...file,
            pathname: file.pathname.replace(`${name}/`, ""),
          };
        }),
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch library : " + error },
        { status: 500 }
      );
    }
  });
}
