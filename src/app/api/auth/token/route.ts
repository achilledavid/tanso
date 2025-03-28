import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "No token found in session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      token: {
        sub: token.sub,
        id: token.id,
        username: token.username,
        email: token.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve token" + error },
      { status: 500 }
    );
  }
}
