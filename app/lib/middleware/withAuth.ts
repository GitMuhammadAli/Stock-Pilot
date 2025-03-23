import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./authMiddleware";

type ApiHandler = (req: NextRequest, res: NextResponse, user: any) => Promise<NextResponse> | NextResponse;

export const withAuth = (handler: ApiHandler): ApiHandler => {
  return async (req: NextRequest, res: NextResponse) => {
    const authResponse = await authMiddleware(req);
    
    if (authResponse instanceof NextResponse) {
      return authResponse; 
    }

    const { user } = authResponse; 

    if (!user) {
      return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 });
    }


    return handler(req, res, user); 
  };
};
