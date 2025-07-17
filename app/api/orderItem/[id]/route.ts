// app/api/order-item/[id]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderItemService } from "@/lib/services/orderItemServices"; // Import the singleton instance
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb"; // Import connectDB

interface Params {
  id: string;
}

async function handler(
   req: NextRequest,
  res:NextResponse,
  context: { params: { [key: string]: string | string[] } },
  user: any
) {
  try {
    await connectDB();
    const orderItemId = context.params.id as string;

    if (!orderItemId) {
      return NextResponse.json(
        { success: false, message: "Order Item ID is required." },
        { status: 400 }
      );
    }

    if (req.method === "GET") {
      console.log(`Fetching Order Item with ID: ${orderItemId}`);
      const response = await orderItemService.getOrderItemById(orderItemId);

      if (response.success) {
        if (!response.data) {
          return NextResponse.json({ success: false, message: response.message }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else if (req.method === "PUT") {
      const body = await req.json();
      console.log(`Updating Order Item ID ${orderItemId} with data:`, body);

      const response = await orderItemService.updateOrderItem(orderItemId, body);

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("greater than 0") || response.message.includes("cannot be negative") ? 400 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else if (req.method === "DELETE") {
      console.log(`Deleting Order Item with ID: ${orderItemId}`);

      const response = await orderItemService.deleteOrderItem(orderItemId);

      if (response.success) {
        return NextResponse.json({ success: true, message: response.message }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Order Item API Handler (ID) Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Order Item API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);