import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const url = request.url;
  const { searchParams } = new URL(url);
  const encryptMessage = searchParams.get("encryptMessage");
  const decryptMessage = searchParams.get("decryptMessage");

  const secret_key = process.env.SECRET_KEY || "";

  if (encryptMessage) {
    const encodedMessage = jwt.sign({ msg: encryptMessage }, secret_key, {
      expiresIn: "10m",
    });

    return NextResponse.json({ data: { encodedMessage } }, { status: 200 });
  } else if (decryptMessage) {
    try {
      const decryptedMessage = jwt.verify(decryptMessage, secret_key);

      return NextResponse.json({ data: { decryptedMessage } }, { status: 200 });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          {
            error: "Token expired",
            message: "The token has expired. Please request a new one.",
            code: "TOKEN_EXPIRED",
          },
          { status: 401 }
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          {
            error: "Invalid token",
            message: "The provided token is invalid.",
            code: "INVALID_TOKEN",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error: "Token verification failed",
            message: "An error occurred while verifying the token.",
            code: "VERIFICATION_FAILED",
          },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
}
