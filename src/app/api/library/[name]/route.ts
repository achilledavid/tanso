import { authOptions } from "@/lib/auth";
import { del, list, put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

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


export async function POST(request: NextRequest, { params }: { params: Promise<{ name: string }> }): Promise<NextResponse> {
  const { name } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!session.user.username) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const username = session.user.username;

  if (name != username) return NextResponse.json({ error: 'Unauthorized access to library' }, { status: 401 });

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('file');

    if (!files.length) {
      return NextResponse.json({ error: 'No files found in the request' }, { status: 400 });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          return { error: 'Invalid file object' };
        }

        const blob = await put(`${username}/${file.name}`, file, {
          access: 'public',
        });

        return { ...blob, original: file.name };
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error processing files:', error);
    return NextResponse.json({ error: 'Failed to process files' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ name: string }> }): Promise<NextResponse> {
  try {
    const { name } = await params;
    const session = await getServerSession(authOptions);
    const formData = await request.formData();
    const urls = formData.getAll('url');

    if (!session?.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!session.user.username) {
      return NextResponse.json({ error: 'Username not found' }, { status: 404 });
    }

    const username = session.user.username;

    if (name != username) return NextResponse.json({ error: 'Unauthorized access to library' }, { status: 401 });

    if (!urls.length) {
      return NextResponse.json({ error: 'At least one URL is required' }, { status: 400 });
    }

    await Promise.all(
      urls.map(async (url) => {
        if (typeof url !== 'string') {
          throw new Error('Invalid URL format');
        }

        await prisma.pad.updateMany({
          where: {
            url,
            project: {
              user: {
                username: name
              }
            }
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
    console.error('Error deleting files:', error);
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 });
  }
}
