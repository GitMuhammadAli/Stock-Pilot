import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./authMiddleware";

type Params = {
  [key: string]: string | string[];
};

// Handler does NOT receive a res parameter; it returns a NextResponse
type ApiHandler = (
  req: NextRequest,
  context: { params: Params },
  user: any
) => Promise<NextResponse> | NextResponse;

export const withAuth = (handler: ApiHandler): ApiHandler => {
  return async (req: NextRequest, context: { params: Params } = { params: {} }) => {
    const authResponse = await authMiddleware(req);

    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const { user } = authResponse;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 401 }
      );
    }

    return handler(req, context, user);
  };
};