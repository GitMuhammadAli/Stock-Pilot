import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("authToken")?.value;
    
    // Get all cookies for debugging
    const allCookies = (await cookieStore).getAll();
    
    if (!authToken) {
      return NextResponse.json({
        authenticated: false,
        message: "No auth token found",
        allCookies: allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 10) + '...' })),
        headers: Object.fromEntries(req.headers)
      });
    }
    
    // Verify the token
    try {
      const secret = process.env.JWT_SECRET || "fallback-secret-key-for-development";
      const decoded = jwt.verify(authToken, secret);
      
      return NextResponse.json({
        authenticated: true,
        user: decoded,
        tokenInfo: {
          length: authToken.length,
          preview: authToken
        },
        allCookies: allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 10) + '...' }))
      });
    } catch (error) {
      return NextResponse.json({
        authenticated: false,
        message: "Invalid token",
        error,
        tokenPreview: authToken.substring(0, 20) + '...'
      });
    }
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Error checking authentication",
      error
    });
  }
}
