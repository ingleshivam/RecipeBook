import { hashPassword } from "@/actions/hashPassword";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Data : ", data);
    const passwordHash = await hashPassword(data.password);
    console.log("passwordHash : ", passwordHash);

    const response = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: passwordHash,
        role: "U",
        isVerified: 0,
      },
    });
    return NextResponse.json(
      { message: "User created successfully", data: response },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error : ", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
