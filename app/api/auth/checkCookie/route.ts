import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("authToken")?.value;
    
    if (!authToken) {
      return NextResponse.json({ 
        authenticated: false, 
        message: "No auth token found" 
      });
    }
    
    // Verify the token
    const secret = process.env.JWT_SECRET || "fallback-secret-key-for-development";
    const decoded = verify(authToken, secret);
    
    return NextResponse.json({ 
      authenticated: true, 
      user: decoded 
    });
  } catch (error) {
    console.error("Cookie verification error:", error);
    return NextResponse.json({ 
      authenticated: false, 
      message: "Invalid auth token" 
    }, { status: 401 });
  }
}
