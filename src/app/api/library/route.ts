import { del, list, put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  // TODO: get username from session
  const username = 'achilledavid';

  const files = await list({
    prefix: `${username}/`,
  });

  return NextResponse.json({
    files: files.blobs.map((file) => file),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  // TODO: get username from session
  const username = 'achilledavid';

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

  await del(url);

  return NextResponse.json({ success: true });
}