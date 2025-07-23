import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name: string;
  isVerified: boolean;
}

export async function authMiddleware(req: NextRequest) {
  try {
    const token =
      req.cookies.get("authToken")?.value ||
      (req.headers.get("authorization")?.startsWith("Bearer ")
        ? req.headers.get("authorization")?.split(" ")[1]
        : null);
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }


    const secret = process.env.JWT_SECRET || "mysecret";
    const decoded = jwt.verify(token, secret) as DecodedToken;
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    return { user: decoded }; // Ensure the user is returned correctly
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 });
  }
}
