import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      status: 200, 
      message: {
        success: "Image uploaded successfully",
        error: "",
        url: blob.url 
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          status: 400, 
          message: {
            success: "",
            error: error.message
          }
        }
      );
    }
    return NextResponse.json(
      { 
        status: 500, 
        message: {
          success: "",
          error: "Internal server error"
        }
      }
    );
  }
}