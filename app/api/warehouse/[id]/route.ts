// import { withAuth } from "@/lib/middleware/withAuth";
// import { WarehouseService } from "@/lib/services/warehouseService";
// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/db/connectDb";
// import { User } from "lucide-react";

// async function handler(req: NextRequest, _context: any, user: any) {
//   try {
//     await connectDB();
//     const wareHouseService = new WarehouseService();
//     const userId = user.id;
//     const wareHouseId = req.nextUrl.pathname.split('/').pop();

//     if (!userId)
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );

//     if (!wareHouseId)
//       return NextResponse.json(
//         { success: false, message: "NO WareHouse Id" },
//         { status: 401 }
//       );
//     if (req.method === "PUT") {
//         const data = await req.json();
//         const updatedWareHouse =  await wareHouseService.updateWarehouse(wareHouseId , data)
//         return NextResponse.json(
//           { success: true, message: "Warehouse updated successfully", data: updatedWareHouse },
//           { status: 200 }
//         );

//     } else if (req.method === "GET") {
//         const warehouse = await wareHouseService.getWarehouseById(wareHouseId);
//         return NextResponse.json(
//           { success: true, data: warehouse },
//           { status: 200 }
//         );
//     } else if (req.method === "DELETE") {
//         await wareHouseService.deleteWarehouse(wareHouseId);
//         return NextResponse.json(
//           { success: true, message: "Warehouse deleted successfully" },
//           { status: 200 }
//         );
//     } else {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }
//   } catch (error) {
//     console.error("Warehouse API Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "An error occurred",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// export const PUT = withAuth(handler);
// export const GET = withAuth(handler);
// export const DELETE = withAuth(handler);

// app/api/warehouse/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { warehouseService } from "@/lib/services/warehouseService";
import { connectDB } from "@/db/connectDb";

// Unified handler for GET, PUT, and DELETE requests to /api/warehouse/[id]
async function warehouseIdHandler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const warehouseId = req.nextUrl.pathname.split("/").pop();

    if (!warehouseId) {
      return NextResponse.json(
        { success: false, message: "Warehouse ID is required." },
        { status: 400 }
      );
    }

    const { method } = req;
    const userId = user.id;

    if (method === "GET") {
      console.log(`Fetching Warehouse with ID: ${warehouseId}`);
      const response = await warehouseService.getWarehouseByIdAndUser(warehouseId, userId);

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("not authorized") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    } else if (method === "PUT") {
      const body = await req.json();
      console.log(`Updating Warehouse ID ${warehouseId} with data:`, body);

      const response = await warehouseService.updateWarehouseAndUser(warehouseId, userId, body);

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("not authorized") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    } else if (method === "DELETE") {
      console.log(`Deleting Warehouse with ID: ${warehouseId}`);
      const response = await warehouseService.deleteWarehouseAndUser(warehouseId, userId);

      if (response.success) {
        return NextResponse.json({ success: true, message: response.message }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("not authorized") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
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
    console.error("Warehouse API Handler (ID) Error:", error);
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

// Export the handlers wrapped with authentication middleware
export const GET = withAuth(warehouseIdHandler);
export const PUT = withAuth(warehouseIdHandler);
export const DELETE = withAuth(warehouseIdHandler);