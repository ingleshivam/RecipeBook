import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(
      {
        message: {
          success: "Image uploaded successfully",
          error: "",
          url: blob.url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: {
            success: "",
            error: error.message,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: {
          success: "",
          error: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
