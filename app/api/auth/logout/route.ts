import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Create a response that will clear the auth cookie
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });
  
  // Clear the auth cookie
  response.cookies.delete("authToken");
  
  return response;
}
