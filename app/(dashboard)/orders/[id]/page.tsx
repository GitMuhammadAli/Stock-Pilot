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
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Star,
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

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "cancelled": return "bg-red-500";
      case "draft": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-600";
      case "pending": return "bg-yellow-600";
      case "partial": return "bg-blue-600";
      case "overdue": return "bg-red-600";
      case "refunded": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-600";
      case "high": return "bg-orange-600";
      case "normal": return "bg-blue-600";
      case "low": return "bg-gray-600";
      default: return "bg-gray-600";
    }
  };

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

      {/* Status Badges */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="flex flex-wrap items-center gap-3 p-6">
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.toUpperCase()}
          </Badge>
          <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-white`}>
            Payment: {order.paymentStatus.toUpperCase()}
          </Badge>
          <Badge className={`${getPriorityColor(order.priority)} text-white`}>
            {order.priority.toUpperCase()} PRIORITY
          </Badge>
          {order.isRushOrder && (
            <Badge className="bg-red-600 text-white">RUSH ORDER</Badge>
          )}
          <Badge className="bg-indigo-600 text-white">
            {order.type.toUpperCase()} ORDER
          </Badge>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" /> Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <p className="text-gray-400 text-xs mb-1">Order Type</p>
                <p className="capitalize text-white font-medium">{order.type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Reference Number</p>
                <p className="text-white font-medium">{order.referenceNumber || "—"}</p>
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
              <div className="md:col-span-2">
                <p className="text-gray-400 text-xs mb-1">Purchase Order Number</p>
                <p className="text-white font-medium">{order.purchaseOrderNumber || "—"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Tracking Information */}
          {(order.trackingNumber || order.shippingCarrier) && (
            <Card className="bg-[#1C2333] border-none">
              <CardHeader>
                <CardTitle className="text-[#B6F400] flex items-center">
                  <Truck className="mr-2 h-5 w-5" /> Shipping & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                {order.trackingNumber && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Tracking Number</p>
                    <p className="text-white font-medium">{order.trackingNumber}</p>
                  </div>
                )}
                {order.shippingCarrier && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Shipping Carrier</p>
                    <p className="text-white font-medium">{order.shippingCarrier}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Supplier Information */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Building2 className="mr-2 h-5 w-5" /> Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-white font-medium text-lg">{order.__supplier__?.name}</p>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{order.__supplier__?.address}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{order.__supplier__?.email}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{order.__supplier__?.phone}</span>
                  </div>
                  {order.__supplier__?.website && (
                    <div className="flex items-center text-gray-400">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>{order.__supplier__?.website}</span>
                    </div>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <Badge className={`${
                    order.__supplier__?.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}>
                    {order.__supplier__?.status?.toUpperCase()}
                  </Badge>
                  <Badge className="bg-purple-500 text-white">
                    {order.__supplier__?.tier?.toUpperCase()} TIER
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-600">
                <div>
                  <p className="text-gray-400 text-xs">Contact Person</p>
                  <p className="text-white">{order.__supplier__?.contactPerson}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Credit Limit</p>
                  <p className="text-white">{formatCurrency(order.__supplier__?.creditLimit)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Payment Terms</p>
                  <p className="text-white">{order.__supplier__?.paymentTerms} days</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Tax ID</p>
                  <p className="text-white">{order.__supplier__?.taxId || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Information */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Warehouse className="mr-2 h-5 w-5" /> Warehouse Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-white font-medium text-lg">{order.__warehouse__?.name}</p>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{order.__warehouse__?.location}</span>
                  </div>
                  {order.__warehouse__?.description && (
                    <p className="text-gray-400">{order.__warehouse__?.description}</p>
                  )}
                </div>
                <Badge className={`${
                  order.__warehouse__?.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                } text-white`}>
                  {order.__warehouse__?.status?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-600">
                <div>
                  <p className="text-gray-400 text-xs">Capacity</p>
                  <p className="text-white">{order.__warehouse__?.capacity} units</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Current Occupancy</p>
                  <p className="text-white">{order.__warehouse__?.currentOccupancy} units</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Contact Email</p>
                  <p className="text-white">{order.__warehouse__?.contactEmail}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Contact Phone</p>
                  <p className="text-white">{order.__warehouse__?.contactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Financial & Additional Info */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <DollarSign className="mr-2 h-5 w-5" /> Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tax Amount:</span>
                <span className="text-white font-medium">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Shipping Cost:</span>
                <span className="text-white font-medium">{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount Amount:</span>
                <span className="text-red-400 font-medium">-{formatCurrency(order.discountAmount)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 flex justify-between items-center">
                <span className="text-white font-bold">Total Amount:</span>
                <span className="text-[#B6F400] font-bold text-lg">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Paid Amount:</span>
                <span className="text-green-400 font-medium">{formatCurrency(order.paidAmount)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                <span className="text-gray-400">Remaining Balance:</span>
                <span className="text-yellow-400 font-medium">
                  {formatCurrency(Number(order.totalAmount) - Number(order.paidAmount))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Created By Information */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <User className="mr-2 h-5 w-5" /> Created By
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 space-y-3">
              <div>
                <p className="text-white font-medium">{order.__createdBy__?.name}</p>
                <p className="text-gray-400">{order.__createdBy__?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-600">
                <div>
                  <p className="text-gray-400 text-xs">Role</p>
                  <Badge className="bg-blue-500 text-white mt-1">
                    {order.__createdBy__?.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Status</p>
                  <Badge className={`${
                    order.__createdBy__?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  } text-white mt-1`}>
                    {order.__createdBy__?.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Metadata */}
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Clock className="mr-2 h-5 w-5" /> Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 space-y-3">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
              {order.shippedDate && (
                <div className="flex justify-between">
                  <span>Shipped:</span>
                  <span>{formatDate(order.shippedDate)}</span>
                </div>
              )}
              {order.deliveredDate && (
                <div className="flex justify-between">
                  <span>Delivered:</span>
                  <span>{formatDate(order.deliveredDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes & Additional Information */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="p-6">
          <Tabs defaultValue="notes">
            <TabsList className="bg-[#2C3444] border-none">
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Order Notes
              </TabsTrigger>
              <TabsTrigger
                value="internal"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Internal Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4 text-gray-300 text-sm">
              {order.notes ? (
                <div className="bg-[#2C3444] p-4 rounded-lg">
                  {order.notes}
                </div>
              ) : (
                <p className="text-gray-500 italic">No notes for this order</p>
              )}
            </TabsContent>
            <TabsContent value="internal" className="mt-4 text-gray-300 text-sm">
              {order.internalNotes ? (
                <div className="bg-[#2C3444] p-4 rounded-lg">
                  {order.internalNotes}
                </div>
              ) : (
                <p className="text-gray-500 italic">No internal notes for this order</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}