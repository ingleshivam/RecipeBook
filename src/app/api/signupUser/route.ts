import { hashPassword } from "@/actions/hashPassword";
import prisma from "@/lib/prisma";
import { PROJECT } from "@/lib/project";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();
    const passwordHash = await hashPassword(newPassword);

    const updateUser = await prisma?.user.updateMany({
      where: {
        email: email,
        project: PROJECT,
      } as any,
      data: {
        passwordHash: passwordHash,
      },
    });

    return NextResponse.json(
      { message: "Password updated  successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Password updation failed !" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const passwordHash = await hashPassword(data.password);

    const userExistsAndNotVerified = await prisma?.user.findFirst({
      where: {
        email: data?.email,
        isVerified: 0,
        project: PROJECT,
      } as any,
    });

    const userExistaAndVerified = await prisma?.user.findFirst({
      where: {
        email: data?.email,
        isVerified: 1,
        project: PROJECT,
      } as any,
    });

    if (userExistsAndNotVerified) {
      return NextResponse.json(
        { message: "User Already Exists !", data: userExistsAndNotVerified },
        { status: 201 }
      );
    } else if (userExistaAndVerified) {
      return NextResponse.json(
        { message: "User Already Exists !", data: userExistaAndVerified },
        { status: 409 }
      );
    }

    const response = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: passwordHash,
        role: "U",
        isVerified: 0,
        project: PROJECT,
      } as any,
    });
    return NextResponse.json(
      { message: "User created successfully", data: response },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
