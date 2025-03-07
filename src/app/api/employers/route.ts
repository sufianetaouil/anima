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

    const employer = await prisma.employer.create({
      data: {
        businessName: body.businessName,
        phone: body.phone || null,
        faxNumber: body.faxNumber || null,
        cellPhone: body.cellPhone || null,
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
    console.error("[EMPLOYERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employers = await prisma.employer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(employers);
  } catch (error) {
    console.error("[EMPLOYERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 