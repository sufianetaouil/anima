import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const refund = await prisma.refund.create({
      data: {
        employeeId: body.employeeId,
        refundDate: new Date(body.refundDate),
        refundAgent: body.refundAgent,
        paidBefore: body.paidBefore,
        hoursWorking: body.hoursWorking,
        salaryPerHour: body.salaryPerHour,
        commissionRate: body.commissionRate,
        lastBalance: body.lastBalance,
      },
    });

    return NextResponse.json(refund);
  } catch (error) {
    console.error("[REFUNDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const refunds = await prisma.refund.findMany({
      include: {
        employee: {
          select: {
            memberId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(refunds);
  } catch (error) {
    console.error("[REFUNDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 