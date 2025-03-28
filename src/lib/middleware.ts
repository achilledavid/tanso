import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { JWT } from "next-auth/jwt";

export async function authenticateRequest(
  req: NextRequest
): Promise<JWT | null> {
  try {
    const token = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return token;
    }

    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return null;
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: JWT) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = await authenticateRequest(req);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handler(req, token);
}
