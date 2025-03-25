import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }): Promise<NextResponse> {
  const { name } = await params;

  const files = await list({
    prefix: `${name}/`
  });

  files.blobs = files.blobs.sort((a, b) => {
    return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
  });

  return NextResponse.json({
    files: files.blobs.map((file) => {
      return {
        ...file,
        pathname: file.pathname.replace(`${name}/`, '')
      };
    }),
  });
}
