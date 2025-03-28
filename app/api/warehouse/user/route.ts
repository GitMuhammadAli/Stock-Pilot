import { withAuth } from "@/lib/middleware/withAuth";
import { WarehouseService } from "@/lib/services/warehouseService";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";



async function handler(req: NextRequest, res: NextResponse, user: any) {
    try {
        await connectDB();
        const warehouseService = new WarehouseService()
        const userId = user.userId;
        console.log("userId", userId)
        const response = await warehouseService.getWarehousesByUser(userId)

        return NextResponse.json({ success: true, data: response });

    } catch (error) {
        console.error("Error Creating Warehouse:", error);
        return NextResponse.json({
            success: false,
            message: "Error Retriving Warehouse by userId",
            error,
        });
    }
}


export const GET = withAuth(handler)