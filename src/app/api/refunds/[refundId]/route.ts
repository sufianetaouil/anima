import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

type Params = Promise<{ refundId: string }>;

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions) as Session;
    const resolvedParams = await params;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const refund = await prisma.refund.findUnique({
      where: {
        id: resolvedParams.refundId,
      },
      include: {
        employee: true,
      },
    });

    return NextResponse.json(refund);
  } catch (error) {
    console.error("[REFUND_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions) as Session;
    const resolvedParams = await params;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const refund = await prisma.refund.update({
      where: {
        id: resolvedParams.refundId,
      },
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
    console.error("[REFUND_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions) as Session;
    const resolvedParams = await params;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const refund = await prisma.refund.delete({
      where: {
        id: resolvedParams.refundId,
      },
    });

    return NextResponse.json(refund);
  } catch (error) {
    console.error("[REFUND_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 