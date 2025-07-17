import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./authMiddleware";


type Params = {
  [key: string]: string | string[];
};

type ApiHandler = (req: NextRequest,res:NextResponse , context: { params: Params }, user: any) => Promise<NextResponse> | NextResponse;

export const withAuth = (handler: ApiHandler): ApiHandler => {

  return async (req: NextRequest, res:NextResponse, context?: { params: Params }) => {
    const authResponse = await authMiddleware(req);
    
    if (authResponse instanceof NextResponse) {
      return authResponse; 
    }

    const { user } = authResponse; 

    if (!user) {
      return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 });
    }



    return handler(req, res, context ?? { params: {} }, user);
  };
};
