import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: params.jobId,
      },
      include: {
        employer: true,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("[JOB_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const job = await prisma.job.update({
      where: {
        id: params.jobId,
      },
      data: {
        employerId: body.employerId,
        daysNumber: body.daysNumber,
        daysPerWeek: body.daysPerWeek,
        hoursNumber: body.hoursNumber,
        pricePerHour: body.pricePerHour,
        tips: body.tips,
        paymentMethod: body.paymentMethod,
        jobType: body.jobType,
        language: body.language,
        jobStatus: body.jobStatus,
        jobTime: body.jobTime,
        status: body.status,
        jobDate: body.jobDate ? new Date(body.jobDate) : null,
        description: body.description,
        requirements: body.requirements,
        benefits: body.benefits,
        location: body.location,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("[JOB_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const job = await prisma.job.delete({
      where: {
        id: params.jobId,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("[JOB_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
