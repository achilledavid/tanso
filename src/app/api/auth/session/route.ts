import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: token.id,
        username: token.username,
        email: token.email,
        name: token.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Session validation failed" + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: token.id,
        username: token.username,
        email: token.email,
        name: token.name,
      },
      accessToken: token.sub || token.jti,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Session update failed" + error },
      { status: 500 }
    );
  }
}
