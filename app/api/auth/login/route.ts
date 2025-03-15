import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authServices";
import { AppDataSource } from "@/db/data-source";
import { connectDB } from "@/db/connectDb";
import Email from "next-auth/providers/email";


export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Request Body:", body);
  const { email } = body
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required." },
      { status: 400 }
    );
  }

  await connectDB();
  const authService = new AuthService();
  const response = await authService.login({ email });

  return NextResponse.json(response);
    
}