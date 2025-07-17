// app/api/order/user/[userId]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderService } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";


async function handler(
  req: NextRequest,
) {
  try {
    await connectDB();
    const targetUserId = req.nextUrl.pathname.split("/").pop();

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "User ID is required in the path." },
        { status: 400 }
      );
    }

    if (req.method === "GET") {
      console.log(`Fetching Orders for User ID: ${targetUserId}`);
      const response = await orderService.getOrdersByUser(targetUserId);

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Order by User API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Order by User API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);