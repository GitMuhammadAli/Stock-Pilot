import { withAuth } from "@/lib/middleware/withAuth";
import { WarehouseService } from "@/lib/services/warehouseService";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    
  
    await connectDB();
    const wareHouseService = new WarehouseService();
    const userId = user.userId; 
    console.log(user)
    console.log(userId)

    if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if(req.method === "POST"){
        const body = await req.json();
        console.log("Request Body:", body);
        
        const response = await wareHouseService.createWarehouse({ createdById: userId, ...body });
        
        return NextResponse.json({ success: true , data: response });
    }else if(req.method==="GET"){
        console.log("Fetching All Warehouses - ");
        const response = await wareHouseService.getAllWarehouses();
        return NextResponse.json({ success: true, data: response }, { status: 200 });
    }else{
        return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error("Warehouse API Error:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
export const POST = withAuth(handler);
export const GET = withAuth(handler);