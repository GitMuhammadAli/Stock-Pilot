"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Building2,
  Warehouse,
  Calendar,
  AlertTriangle,
  Truck,
  ClipboardList,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useOrder } from "@/providers/orderProvider";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getOrder, deleteOrder } = useOrder();

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const data = await getOrder(id as string);
      setOrder(data);
      setLoading(false);
    };
    fetch();
  }, [id, getOrder]);

  if (loading) return <p className="text-gray-400">Loading order...</p>;
  if (!order) return <p className="text-red-500">Order not found</p>;

  const handleDelete = async () => {
    if (!confirm("Delete this order?")) return;
    await deleteOrder(order.id);
    router.push("/orders");
  };

  const formatCurrency = (n: string | number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(n || 0));

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleString() : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Order {order.orderNumber}
          </h1>
          <p className="text-gray-400 text-sm">
            Created {formatDate(order.createdAt)} by{" "}
            {order.__createdBy__?.name || "Unknown"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/orders">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-[#2C3444]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <Link href={`/orders/${order.id}/edit`}>
            <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          </Link>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Status */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="flex items-center gap-3 p-6">
          <Badge
            className={`${
              order.status === "completed"
                ? "bg-green-500"
                : order.status === "pending"
                ? "bg-yellow-500"
                : "bg-gray-500"
            } text-white`}
          >
            {order.status.toUpperCase()}
          </Badge>
          <Badge
            className={`${
              order.paymentStatus === "paid"
                ? "bg-green-600"
                : "bg-orange-600"
            } text-white`}
          >
            Payment: {order.paymentStatus}
          </Badge>
          {order.isRushOrder && (
            <Badge className="bg-red-600 text-white">Rush Order</Badge>
          )}
          <Badge className="bg-purple-600 text-white">
            {order.priority} priority
          </Badge>
        </CardContent>
      </Card>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" /> Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <p className="text-gray-400 text-xs mb-1">Order Type</p>
                <p className="capitalize">{order.type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Reference #</p>
                <p>{order.referenceNumber || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Order Date</p>
                <p>{formatDate(order.orderDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Due Date</p>
                <p>{formatDate(order.dueDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Shipped Date</p>
                <p>{formatDate(order.shippedDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Delivered Date</p>
                <p>{formatDate(order.deliveredDate)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Supplier */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Building2 className="mr-2 h-5 w-5" /> Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 space-y-1">
              <p className="text-white font-medium">{order.__supplier__?.name}</p>
              <p>{order.__supplier__?.address}</p>
              <p>Email: {order.__supplier__?.email}</p>
              <p>Phone: {order.__supplier__?.phone}</p>
              <p>Contact: {order.__supplier__?.contactPerson}</p>
            </CardContent>
          </Card>

          {/* Warehouse */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Warehouse className="mr-2 h-5 w-5" /> Warehouse
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 space-y-1">
              <p className="text-white font-medium">
                {order.__warehouse__?.name}
              </p>
              <p>{order.__warehouse__?.location}</p>
              <p>{order.__warehouse__?.description}</p>
              <p>
                Capacity: {order.__warehouse__?.capacity} | Current:{" "}
                {order.__warehouse__?.currentOccupancy}
              </p>
              <p>Email: {order.__warehouse__?.contactEmail}</p>
              <p>Phone: {order.__warehouse__?.contactPhone}</p>
            </CardContent>
          </Card>
        </div>

        {/* Financial */}
        <div className="space-y-6">
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6 space-y-3 text-sm text-gray-300">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-white">Financials</h3>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="text-white">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-white">{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="text-white">
                  -{formatCurrency(order.discountAmount)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-[#B6F400]">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span className="text-white">{formatCurrency(order.paidAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for events/notes */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="p-6">
          <Tabs defaultValue="notes">
            <TabsList className="bg-[#2C3444] border-none">
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4 text-gray-300 text-sm">
              {order.notes || "No notes for this order"}
            </TabsContent>
            <TabsContent value="timeline" className="mt-4 text-gray-300 text-sm space-y-2">
              <p>
                <Clock className="inline h-4 w-4 mr-2 text-yellow-500" />
                Created: {formatDate(order.createdAt)}
              </p>
              <p>
                <CheckCircle2 className="inline h-4 w-4 mr-2 text-green-500" />
                Updated: {formatDate(order.updatedAt)}
              </p>
              {order.shippedDate && (
                <p>
                  <Truck className="inline h-4 w-4 mr-2 text-blue-500" />
                  Shipped: {formatDate(order.shippedDate)}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
