import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authServices";
import { AppDataSource } from "@/db/data-source";
import { connectDB } from "@/db/data-source";
import Email from "next-auth/providers/email";

export async function POST(req: NextRequest) {
    // console.log(req.json())
  const { email } = await req.json();

  
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required." },
      { status: 400 }
    );
  }

  await connectDB();
  const authService = new AuthService();
  const response = await authService.register({ email });

  return NextResponse.json(response);
}
