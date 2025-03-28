import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params;
      const requestedUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!requestedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(requestedUser);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch user : " + error },
        { status: 500 }
      );
    }
  });
}

export function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, authUser) => {
    try {
      const { id } = await params;
      const data = (await req.json()) as UpdateUserPayload;

      const userToUpdate = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!userToUpdate) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if the authenticated user is the same as the one being updated
      if (authUser.id !== parseInt(id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await prisma.user.update({
        where: { id: parseInt(id) },
        data,
      });

      return NextResponse.json({ message: "User updated successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update user: " + error },
        { status: 500 }
      );
    }
  });
}

export function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, authUser) => {
    try {
      const { id } = await params;

      const userToDelete = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!userToDelete) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if the authenticated user is the same as the one being deleted
      if (authUser.id !== parseInt(id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete user: " + error },
        { status: 500 }
      );
    }
  });
}
