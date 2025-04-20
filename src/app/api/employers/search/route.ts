import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const employers = await prisma.employer.findMany({
      where: {
        OR: [
          {
            businessName: {
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
          {
            state: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        businessName: true,
        phone: true,
        state: true,
      },
      orderBy: {
        businessName: "asc",
      },
      take: 10,
    });

    return NextResponse.json(employers);
  } catch (error) {
    console.error("[EMPLOYERS_SEARCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 