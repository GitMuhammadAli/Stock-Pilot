import { NextRequest, NextResponse } from "next/server";

export const requireRole = (roles: string[], handler: (req: NextRequest, res: NextResponse, user: any) => Promise<NextResponse> | NextResponse) => {
  return async (req: NextRequest, res: NextResponse, user: any) => {
    if (!roles.includes(user.role)) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    return handler(req, res, user);
  };
};
