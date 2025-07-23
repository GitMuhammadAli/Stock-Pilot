import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from '@/lib/utils/jwt';
import { AuthService } from '@/lib/services/authServices';
import { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@/db/connectDb";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found"
      }, { status: 401 });
    }

    const decoded = verifyJwt(token);

    let userId: string | undefined;
    if (typeof decoded === "object" && decoded !== null) {
      userId = (decoded as any).id || (decoded as any).userId;
    }

    console.log("i ammmm" , userId)

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        message: "Invalid token payload"
      }, { status: 401 });
    }
 await connectDB();
    const authService = new AuthService();
    const user = await authService.userExists({ id: userId });
    console.log("i am user after user exits ", user)

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: "User does not exist"
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Invalid token",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 401 });
  }
}