
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authServices";
import { connectDB } from "@/db/connectDb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token is required." },
      { status: 400 }
    );
  }

  await connectDB();
  const authService = new AuthService();
  const response = await authService.verify({ token });
  console.log("respoooo" , response)

  if (!response.success) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(response.message)}`, req.url)
    );
  }

  const redirectUrl = new URL('/complete-login', req.url);
  const responseRedirect = NextResponse.redirect(redirectUrl);

  if (response.token) {
    responseRedirect.cookies.set({
      name: 'authToken',
      value: response.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict'
    });
  }

  return responseRedirect;
}
