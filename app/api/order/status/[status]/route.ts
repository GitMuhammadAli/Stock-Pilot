// app/api/order/status/[status]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderService } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";
import { OrderStatus } from "@/db/entities/order"; // Import OrderStatus enum

async function handler(
  req: NextRequest,
  user: any
) {
  try {
    await connectDB();
    const targetStatus = req.nextUrl.pathname.split("/").pop() as OrderStatus;

    // Validate if the provided status is a valid OrderStatus enum value
    if (!Object.values(OrderStatus).includes(targetStatus)) {
      return NextResponse.json(
        { success: false, message: `Invalid order status: ${targetStatus}` },
        { status: 400 }
      );
    }

    if (req.method === "GET") {
      console.log(`Fetching Orders with Status: ${targetStatus}`);
      const response = await orderService.getOrdersByStatus(targetStatus);

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
    console.error("Order by Status API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Order by Status API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);