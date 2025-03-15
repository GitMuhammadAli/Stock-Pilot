import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        authenticated: false,
        message: "No token provided"
      }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token
    const decoded = verifyJwt(token);
    
    return NextResponse.json({
      authenticated: true,
      user: decoded
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Invalid token",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 401 });
  }
}
