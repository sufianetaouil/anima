import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const job = await prisma.job.create({
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
    console.error("[JOBS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      include: {
        employer: {
          select: {
            businessName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("[JOBS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
