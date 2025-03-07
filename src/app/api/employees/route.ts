import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMemberId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Generate a unique member ID
    let memberId = generateMemberId();
    let isUnique = false;

    while (!isUnique) {
      const existing = await prisma.employee.findUnique({
        where: { memberId },
      });
      if (!existing) {
        isUnique = true;
      } else {
        memberId = generateMemberId();
      }
    }

    // Combine first and last name
    const name = `${body.firstName} ${body.lastName}`.trim();

    const employee = await prisma.employee.create({
      data: {
        memberId,
        name,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zip: body.zip || null,
        gender: body.gender || null,
        status: body.status || null,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("[EMPLOYEES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("[EMPLOYEES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
