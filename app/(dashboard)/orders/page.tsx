"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  Building2,
  Warehouse,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOrder } from "@/providers/orderProvider";
import { OrderStatus, OrderType, PaymentStatus } from "@/types";

// --- Status styling ---
const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  partial: "bg-blue-500/20 text-blue-400",
  overdue: "bg-red-500/20 text-red-400",
  refunded: "bg-orange-500/20 text-orange-400",
};

// --- StatusIcon Component ---
function StatusIcon({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  switch (status) {
    case "pending":
      return <Clock className={className} />;
    case "processing":
    case "confirmed":
      return <Loader2 className={`${className} animate-spin`} />;
    case "completed":
    case "delivered":
      return <CheckCircle className={className} />;
    case "cancelled":
      return <XCircle className={className} />;
    case "shipped":
      return <Truck className={className} />;
    case "draft":
      return <Package className={className} />;
    default:
      return null;
  }
}

function OrderTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  switch (type) {
    case "purchase":
      return <Building2 className={className} />;
    case "sales":
      return <DollarSign className={className} />;
    case "transfer":
      return <Truck className={className} />;
    case "adjustment":
      return <Package className={className} />;
    default:
      return <Package className={className} />;
  }
}

export default function OrderListPage() {
  const router = useRouter();
  const { orders, loading, getAllOrdersForUser, updateOrder, deleteOrder } =
    useOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    getAllOrdersForUser();
  }, [getAllOrdersForUser]);

  // --- Derived: Filtered & Sorted Orders ---
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.__supplier__?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.__warehouse__?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.__createdBy__?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        const matchesType =
          typeFilter === "all" || order.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        let aValue: any = a[sortBy as keyof typeof a];
        let bValue: any = b[sortBy as keyof typeof b];

        // Handle nested properties
        if (sortBy === "supplier") {
          aValue = a.__supplier__?.name;
          bValue = b.__supplier__?.name;
        } else if (sortBy === "warehouse") {
          aValue = a.__warehouse__?.name;
          bValue = b.__warehouse__?.name;
        } else if (sortBy === "createdBy") {
          aValue = a.__createdBy__?.name;
          bValue = b.__createdBy__?.name;
        }

        // Handle numeric values
        if (["subtotal", "taxAmount", "shippingCost", "discountAmount", "totalAmount", "paidAmount"].includes(sortBy)) {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        }

        // Handle dates
        if (["createdAt", "updatedAt", "orderDate", "dueDate", "shippedDate", "deliveredDate"].includes(sortBy)) {
          aValue = new Date(aValue || 0).getTime();
          bValue = new Date(bValue || 0).getTime();
        }

        const modifier = sortOrder === "asc" ? 1 : -1;

        if (aValue < bValue) return -modifier;
        if (aValue > bValue) return modifier;
        return 0;
      });
  }, [orders, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  // --- Helpers ---
  const formatCurrency = (amount: string | number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount || 0));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatShortDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  // Calculate stats from actual data
  const stats = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    let totalValue = 0;
    let completedValue = 0;

    orders.forEach((order) => {
      // Status counts
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      
      // Type counts
      typeCounts[order.type] = (typeCounts[order.type] || 0) + 1;
      
      // Financial totals
      const orderTotal = Number(order.totalAmount) || 0;
      totalValue += orderTotal;
      
      if (order.status === "completed") {
        completedValue += orderTotal;
      }
    });

    return {
      totalOrders: orders.length,
      totalValue,
      completedValue,
      statusCounts,
      typeCounts,
      pending: statusCounts.pending || 0,
      processing: statusCounts.processing || 0,
      completed: statusCounts.completed || 0,
      shipped: statusCounts.shipped || 0,
      cancelled: statusCounts.cancelled || 0,
    };
  }, [orders]);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    await updateOrder(id, {
      status: newStatus,
      type: OrderType.PURCHASE,
      paymentStatus: PaymentStatus.PENDING
    });
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    await deleteOrder(id);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  // --- UI ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">
            Manage and track all orders across your organization
          </p>
        </div>
        <Button
          onClick={() => router.push("/orders/new")}
          className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#A5E000] font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Order
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: Package,
            color: "text-blue-400",
            description: "All orders",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-400",
            description: "Awaiting action",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-green-400",
            description: "Successfully processed",
          },
          {
            label: "Total Value",
            value: formatCurrency(stats.totalValue),
            icon: TrendingUp,
            color: "text-[#B6F400]",
            description: "All orders value",
          },
          {
            label: "Completed Value",
            value: formatCurrency(stats.completedValue),
            icon: DollarSign,
            color: "text-emerald-400",
            description: "Value of completed orders",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1C2333] border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg')} bg-opacity-20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search orders, suppliers, warehouses, or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1C2333] border-gray-600 text-white"
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-[#1C2333] border-gray-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1C2333] border-gray-600">
            <SelectItem value="all" className="text-white hover:bg-[#2C3444]">
              All Status
            </SelectItem>
            {Object.keys(statusColors).map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="text-white hover:bg-[#2C3444]"
              >
                <div className="flex items-center">
                  <StatusIcon status={status} className="w-3 h-3 mr-2" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-[#1C2333] border-gray-600 text-white">
            <Package className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#1C2333] border-gray-600">
            <SelectItem value="all" className="text-white hover:bg-[#2C3444]">
              All Types
            </SelectItem>
            {Object.values(OrderType).map((type) => (
              <SelectItem
                key={type}
                value={type}
                className="text-white hover:bg-[#2C3444]"
              >
                <div className="flex items-center">
                  <OrderTypeIcon type={type} className="w-3 h-3 mr-2" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-[#1C2333] border-gray-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#1C2333] border-gray-600">
            <SelectItem value="createdAt" className="text-white hover:bg-[#2C3444]">
              Created Date
            </SelectItem>
            <SelectItem value="orderDate" className="text-white hover:bg-[#2C3444]">
              Order Date
            </SelectItem>
            <SelectItem value="dueDate" className="text-white hover:bg-[#2C3444]">
              Due Date
            </SelectItem>
            <SelectItem value="totalAmount" className="text-white hover:bg-[#2C3444]">
              Total Amount
            </SelectItem>
            <SelectItem value="orderNumber" className="text-white hover:bg-[#2C3444]">
              Order Number
            </SelectItem>
            <SelectItem value="supplier" className="text-white hover:bg-[#2C3444]">
              Supplier
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="w-full sm:w-auto bg-[#1C2333] border-gray-600 text-white"
        >
          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[#1C2333] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Orders ({filteredOrders.length})</span>
              <div className="text-sm text-gray-400 font-normal">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No orders found</p>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first order to get started"}
                </p>
                <Button
                  onClick={() => router.push("/orders/new")}
                  className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#A5E000] font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Order
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Order #</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Payment</TableHead>
                      <TableHead className="text-gray-300">Supplier</TableHead>
                      <TableHead className="text-gray-300">Warehouse</TableHead>
                      <TableHead className="text-gray-300">Created By</TableHead>
                      <TableHead className="text-gray-300 text-right">Total</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-gray-700 hover:bg-[#2C3444] transition-colors"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-white font-medium">
                                {order.orderNumber}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {order.referenceNumber || "No reference"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <OrderTypeIcon type={order.type} className="w-4 h-4 text-blue-400" />
                              <Badge variant="outline" className="text-gray-400 border-gray-600 capitalize">
                                {order.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-auto p-2 font-medium capitalize",
                                    statusColors[order.status] || "bg-gray-500/20 text-gray-400"
                                  )}
                                >
                                  <StatusIcon
                                    status={order.status}
                                    className="w-3 h-3 mr-1"
                                  />
                                  {order.status}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#1C2333] border-gray-600">
                                {Object.keys(statusColors).map((status) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => handleStatusChange(order.id, status as OrderStatus)}
                                    className="text-white hover:bg-[#2C3444]"
                                  >
                                    <StatusIcon
                                      status={status}
                                      className="w-4 h-4 mr-2"
                                    />
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "capitalize",
                              paymentStatusColors[order.paymentStatus] || "bg-gray-500/20 text-gray-400"
                            )}>
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-white font-medium">
                                {order.__supplier__?.name || "No supplier"}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {order.__supplier__?.contactPerson || "No contact"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-300">
                              {order.__warehouse__?.name || "No warehouse"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-white text-sm">
                                {order.createdBy?.name || "Unknown"}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {order.createdBy?.role || "No role"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <p className="text-white font-semibold">
                                {formatCurrency(order.totalAmount)}
                              </p>
                              {Number(order.paidAmount) > 0 && (
                                <p className="text-green-400 text-xs">
                                  Paid: {formatCurrency(order.paidAmount)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-gray-400 text-sm">
                                {formatShortDate(order.createdAt)}
                              </p>
                              {order.dueDate && (
                                <p className="text-yellow-400 text-xs">
                                  Due: {formatShortDate(order.dueDate)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white hover:bg-[#2C3444]"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="bg-[#1C2333] border-gray-600"
                                align="end"
                              >
                                <DropdownMenuItem
                                  onClick={() => router.push(`/orders/${order.id}`)}
                                  className="text-white hover:bg-[#2C3444]"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/orders/${order.id}/edit`)}
                                  className="text-white hover:bg-[#2C3444]"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Order
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-600" />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}