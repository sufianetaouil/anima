import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    // Check if trying to update admin user's email or role
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { email: true },
    });

    if (targetUser?.email === "admin@naima.com") {
      // Only allow updating the name for the admin user
      const user = await prisma.user.update({
        where: {
          id: params.userId,
        },
        data: {
          name: body.name,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
        },
      });

      return NextResponse.json(user);
    }

    // For non-admin users, allow updating all fields
    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name: body.name,
        email: body.email,
        isAdmin: body.isAdmin,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check if trying to delete admin user
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { email: true },
    });

    if (targetUser?.email === "admin@naima.com") {
      return new NextResponse("Cannot delete admin user", { status: 403 });
    }

    const user = await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 