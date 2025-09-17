// import { withAuth } from "@/lib/middleware/withAuth";
// import { WarehouseService } from "@/lib/services/warehouseService";
// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/db/connectDb";

// async function handler(req: NextRequest, _context: any, user: any) {
//   try {
//    console.log('yompom:', req);
    
  
//     await connectDB();
//     const wareHouseService = new WarehouseService();
//     const userId = user.id; 
//     console.log(user)
//     console.log(userId)


//     if (!userId) {
//         return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }


//     if(req.method === "POST"){
//         const body = await req.json();
//         console.log("Request Body:", body);
        
//         const response = await wareHouseService.createWarehouse({ createdById: userId, ...body });
        
//         return NextResponse.json({ success: true , data: response });
//     }else if(req.method==="GET"){
//         console.log("Fetching All Warehouses - ");
//         const response = await wareHouseService.getAllWarehouses();
//         return NextResponse.json({ success: true, data: response }, { status: 200 });
//     }else{
//         return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
//     }
//   } catch (error) {
//     console.error("Warehouse API Error:", error);
//     return NextResponse.json({
//       success: false,
//       message: "An error occurred",
//       error: error instanceof Error ? error.message : "Unknown error",
//     }, { status: 500 });
//   }
// }
// export const POST = withAuth(handler);
// export const GET = withAuth(handler);


import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { warehouseService } from "@/lib/services/warehouseService";
import { connectDB } from "@/db/connectDb";

// Unified handler for POST and GET requests to /api/warehouse
async function warehouseHandler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const { method } = req;
    const userId = user.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: User ID not found." },
        { status: 401 }
      );
    }

    if (method === "POST") {
      const body = await req.json();
      console.log("Create Warehouse Request Body:", body);

      const response = await warehouseService.createWarehouse({
        createdById: userId,
        ...body,
      });

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 201 });
      } else {
        const statusCode = response.message.includes("User not found") ? 400 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else if (method === "GET") {
      console.log("Fetching Warehouses for User.");
      const response = await warehouseService.getWarehousesByUser(userId);

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
    console.error("Warehouse API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Warehouse API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(warehouseHandler);
export const GET = withAuth(warehouseHandler);