import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { otp, userId } = await request.json();

  try {
    await prisma?.userOtp.create({
      data: {
        userId: parseInt(userId),
        otp: String(otp),
        isUsed: 0,
        generatedTimestamp: new Date(),
        expirationTimestamp: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({ message: "" }, { status: 200 });
  } catch (error) {
    console.log("Error : ", error);
    return NextResponse.json({ message: "" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.url;
    const { searchParams } = new URL(url);
    const email = searchParams.get("email");

    const userRecord = await prisma?.user?.findUnique({
      where: {
        email: email || "",
      },
      select: {
        userId: true,
      },
    });

    const otpRecord = await prisma?.userOtp.findFirst({
      where: {
        userId: userRecord?.userId,
        isUsed: 0,
        expirationTimestamp: { gt: new Date() },
      },
      orderBy: {
        generatedTimestamp: "desc",
      },
    });

    return NextResponse.json({ data: otpRecord }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error !" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { otp, email, mail } = await request.json();
  console.log("OTP is : ", otp + " " + "Email is : ", email || mail?.current);
  try {
    await prisma?.user?.update({
      where: {
        email: email || mail?.current,
      },
      data: {
        isVerified: 1,
      },
    });

    await prisma?.userOtp.update({
      where: {
        otp: otp,
      },
      data: {
        isUsed: 1,
      },
    });
    return NextResponse.json(
      { message: "User is successfully verfied !" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error !" },
      { status: 405 }
    );
  }
}
