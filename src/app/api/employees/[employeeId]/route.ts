import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = Promise<{ employeeId: string }>;

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getSession();
    const resolvedParams = await params;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: resolvedParams.employeeId,
      },
      include: {
        refunds: true,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("[EMPLOYEE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getSession();
    const resolvedParams = await params;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const employee = await prisma.employee.update({
      where: {
        id: resolvedParams.employeeId,
      },
      data: {
        name: body.name,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        status: body.status,
        joinDate: body.joinDate ? new Date(body.joinDate) : null,
        gender: body.gender,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        phone: body.phone || null,
        position: body.position,
        jobType: body.jobType,
        jobTime: body.jobTime,
        timeDescription: body.timeDescription,
        hispanic: body.hispanic,
        nationality: body.nationality,
        english: body.english,
        additionalLanguages: body.additionalLanguages,
        ssn: body.ssn,
        howLongInUSA: body.howLongInUSA,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("[EMPLOYEE_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await getSession();
    const resolvedParams = await params;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employee = await prisma.employee.delete({
      where: {
        id: resolvedParams.employeeId,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("[EMPLOYEE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 