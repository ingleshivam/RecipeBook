import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { otp, userId } = await request.json();
  console.log("OTP : ", otp + " " + "userId : ", userId);

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
