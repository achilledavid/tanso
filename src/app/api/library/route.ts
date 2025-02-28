import { authOptions } from '@/lib/auth';
import { del, list, put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!session.user.username) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const username = session.user.username;

  const files = await list({
    prefix: `${username}/`,
  });

  return NextResponse.json({
    files: files.blobs.map((file) => file),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!session.user.username) {
    return NextResponse.json({ error: 'Username not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const username = session.user.username;

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }

  const blob = await put(`${username}/${filename}`, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Url is required' }, { status: 400 });
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

  return NextResponse.json({ success: true });
}