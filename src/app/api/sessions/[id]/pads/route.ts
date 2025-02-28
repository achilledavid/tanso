import { isEmpty } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params;

    const redis = await connectRedis();

    const keys = await redis.keys(`session:${sessionId}:pad:*`);

    if (!keys || isEmpty(keys)) {
      return NextResponse.json([]);
    }

    const padPromises = keys.map(async (key) => {
      const padData = await redis.get(key);
      if (padData) {
        const keyParts = key.split(':');
        const padId = keyParts.length > 0 ? keyParts[keyParts.length - 1] : null;

        if (!padId) {
          console.error(`Impossible d'extraire l'ID du pad depuis la clé: ${key}`);
          return null;
        }

        return { id: padId, sessionId, ...JSON.parse(padData) };
      }
      return null;
    });

    const pads = (await Promise.all(padPromises)).filter(Boolean);

    return NextResponse.json(pads);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id, url } = await req.json();
    const { id: sessionId } = await params;

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

