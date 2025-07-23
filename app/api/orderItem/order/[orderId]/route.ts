// app/api/order-item/order/[orderId]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderItemService } from "@/lib/services/orderItemServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

interface Params {
  orderId: string;
}

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const targetOrderId = _context.params.orderId as string;

    if (!targetOrderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required in the path." },
        { status: 400 }
      );
    }

    if (req.method === "GET") {
      console.log(`Fetching Order Items for Order ID: ${targetOrderId}`);
      const response = await orderItemService.getOrderItemsByOrder(targetOrderId);

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
    console.error("Order Item by Order API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Order Item by Order API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);