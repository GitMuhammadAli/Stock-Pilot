import { withAuth } from "@/lib/middleware/withAuth";
import { WarehouseService } from "@/lib/services/warehouseService";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

async function handler(req: NextRequest, res: NextResponse, user: any) {
  try {
    const body = await req.json();
    console.log("Request Body:", body);
    await connectDB();
    const wareHouseService = new WarehouseService();
    const userId = user.userId; 
    console.log("userId" ,  userId)
    const response = await wareHouseService.createWarehouse({ createdById: userId, ...body });

    return NextResponse.json({ success: true , data: response });
  } catch (error) {
    console.error("Error Creating Warehouse:", error);
    return NextResponse.json({
      success: false,
      message: "Error Creating Warehouse",
      error,
    });
  }
}

export const POST = withAuth(handler);
