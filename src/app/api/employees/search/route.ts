import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          {
            memberId: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        memberId: true,
        name: true,
        phone: true,
      },
      orderBy: [
        {
          memberId: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: 10,
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("[EMPLOYEES_SEARCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 