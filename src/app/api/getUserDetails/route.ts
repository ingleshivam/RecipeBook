import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.url;
  const { searchParams } = new URL(url);
  const email = searchParams.get("email");

  if (!email) {
    try {
      const response = await prisma?.user.findMany();
      return NextResponse.json(
        { response },
        { status: 200, statusText: "User details fetched successfully !" }
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "" },
          { status: 400, statusText: error.message }
        );
      }
    }
  } else {
    try {
      const response = await prisma?.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!response) {
        return NextResponse.json(
          { message: "Email address not found !" },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { message: "User details fetched successfully !", response },
          { status: 200 }
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Internal Server Error !" },
          { status: 404 }
        );
      }
    }
  }
}
