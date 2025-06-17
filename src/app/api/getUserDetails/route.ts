import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await prisma?.user.findMany();
    console.log("userData : ", Date.now());
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
}
