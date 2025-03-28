import { withAuth } from "@/lib/middleware/withAuth";
import { WarehouseService } from "@/lib/services/warehouseService";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";
import { User } from "lucide-react";

async function handler(req: NextRequest, res: NextResponse, user: any) {
  try {
    await connectDB();
    const wareHouseService = new WarehouseService();
    const userId = user.userId;
    const wareHouseId = req.nextUrl.pathname.split('/').pop();

    if (!userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    if (!wareHouseId)
      return NextResponse.json(
        { success: false, message: "NO WareHouse Id" },
        { status: 401 }
      );
    if (req.method === "PUT") {
        const data = await req.json();
        const updatedWareHouse =  await wareHouseService.updateWarehouse(wareHouseId , data)
        return NextResponse.json(
          { success: true, message: "Warehouse updated successfully", data: updatedWareHouse },
          { status: 200 }
        );

    } else if (req.method === "GET") {
        const warehouse = await wareHouseService.getWarehouseById(wareHouseId);
        return NextResponse.json(
          { success: true, data: warehouse },
          { status: 200 }
        );
    } else if (req.method === "DELETE") {
        await wareHouseService.deleteWarehouse(wareHouseId);
        return NextResponse.json(
          { success: true, message: "Warehouse deleted successfully" },
          { status: 200 }
        );
    } else {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Warehouse API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(handler);
export const GET = withAuth(handler);
export const DELETE = withAuth(handler);