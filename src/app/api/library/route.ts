import { authOptions } from '@/lib/auth';
import { del, put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!session.user.username) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const username = session.user.username;

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

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const urls = formData.getAll('url');

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
