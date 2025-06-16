import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { blob } from "stream/consumers";

export async function GET(request: Request) {
  try {
    const { blobs } = await list();
    return NextResponse.json({ status: 200, blobs });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, error: error.message });
    }
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
