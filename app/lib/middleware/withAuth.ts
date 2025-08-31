import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./authMiddleware";
import { connectDB } from "@/db/connectDb";

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
    await connectDB();
    const authResponse = await authMiddleware(req);

    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    console.log("authResponse", authResponse);
    const { user } = authResponse;

    if (!user || !user.id) {
      console.log("Invalid user or missing id");
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 401 }
      );
    }

    console.log("User in withAuth:", user);

    return handler(req, context, user);
  };
};