import { withAuth } from "@/lib/middleware/withAuth";
import { WarehouseService } from "@/lib/services/warehouseService";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

