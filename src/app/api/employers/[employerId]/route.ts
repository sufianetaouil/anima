import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { formatPhoneNumber } from "@/lib/utils";
import { Session } from "next-auth";

type Params = Promise<{ employerId: string }>;

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

    const employer = await prisma.employer.findUnique({
      where: {
        id: resolvedParams.employerId,
      },
      include: {
        jobs: true,
      },
    });

    return NextResponse.json(employer);
  } catch (error) {
    console.error("[EMPLOYER_GET]", error);
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

    const employer = await prisma.employer.update({
      where: {
        id: resolvedParams.employerId,
      },
      data: {
        businessName: body.businessName,
        phone: body.phone ? formatPhoneNumber(body.phone) : null,
        faxNumber: body.faxNumber ? formatPhoneNumber(body.faxNumber) : null,
        cellPhone: body.cellPhone ? formatPhoneNumber(body.cellPhone) : null,
        contactName: body.contactName,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        position: body.position,
        gender: body.gender,
      },
    });

    return NextResponse.json(employer);
  } catch (error) {
    console.error("[EMPLOYER_PUT]", error);
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

    // Delete all associated jobs first
    await prisma.job.deleteMany({
      where: {
        employerId: resolvedParams.employerId,
      },
    });

    // Then delete the employer
    const employer = await prisma.employer.delete({
      where: {
        id: resolvedParams.employerId,
      },
    });

    return NextResponse.json(employer);
  } catch (error) {
    console.error("[EMPLOYER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 