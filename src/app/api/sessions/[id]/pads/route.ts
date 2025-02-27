import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
};

export async function GET({ params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;

    const redis = await connectRedis();

    const keys = await redis.keys(`session:${sessionId}:pad:*`);

    if (!keys || keys.length === 0) {
      return NextResponse.json([]);
    }

    const padPromises = keys.map(async (key) => {
      const padData = await redis.get(key);
      if (padData) {
        const padId = key.split(':').pop();
        return { id: padId, sessionId, ...JSON.parse(padData) };
      }
      return null;
    });

    const pads = (await Promise.all(padPromises)).filter(Boolean);

    return NextResponse.json(pads);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve pads' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id, url } = await request.json();
    const sessionId = params.id;

    if (!id || !url) {
      return NextResponse.json({ error: 'ID and URL required' }, { status: 400 });
    }

    const redis = await connectRedis();

    const padKey = `session:${sessionId}:pad:${id}`;
    const existingPad = await redis.get(padKey);

    if (!existingPad) {
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });
    }

    const padData = JSON.parse(existingPad);
    const updatedData = { ...padData, url };

    await redis.set(padKey, JSON.stringify(updatedData));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

