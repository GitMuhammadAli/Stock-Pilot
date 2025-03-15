import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authServices";
import { connectDB } from "@/db/data-source";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  console.log("Verifying token:", token);
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token is required." },
      { status: 400 }
    );
  }

  await connectDB();
  const authService = new AuthService();
  const response = await authService.verify({ token });

  if (!response.success) {
    return NextResponse.json(response, { status: 400 });
  }

  // Get cookie jar
  const cookieJar = cookies();
  
  if (response.token) {
    // Set the cookie with more compatible options
    (await cookieJar).set({
      name: "authToken",
      value: response.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    // Log cookie setting success
    console.log("🍪 Auth cookie set successfully");
  }

  // Create the response object
  const jsonResponse = NextResponse.json(response);
  
  return jsonResponse;
}
