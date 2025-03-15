import { NextRequest, NextResponse } from "next/server";
import { signJwt } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
  // Create a test token
  const testToken = signJwt({
    userId: "test-user-id",
    email: "test@example.com",
    role: "staff",
    name: "Test User",
    isVerified: true
  });
  
  // Create a response
  const response = NextResponse.json({
    message: "Test token set",
    tokenPreview: testToken
  });
  
  // Set the token as cookies
  response.cookies.set({
    name: "authToken_mw",
    value: testToken,
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  
  return response;
}
