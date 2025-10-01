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

// --- Types ---
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "SHIPPED";

// --- Status styling ---
const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// --- StatusIcon Component ---
function StatusIcon({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  switch (status) {
    case "PENDING":
      return <Clock className={className} />;
    case "PROCESSING":
      return <Loader2 className={`${className} animate-spin`} />;
    case "COMPLETED":
      return <CheckCircle className={className} />;
    case "CANCELLED":
      return <XCircle className={className} />;
    case "SHIPPED":
      return <Truck className={className} />;
    default:
      return null;
  }
}

export default function OrderListPage() {
  const router = useRouter();
  const { orders, loading, getAllOrders, updateOrder, deleteOrder } =
    useOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortBy, setSortBy] = useState<keyof (typeof orders)[0] | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  // --- Derived: Filtered & Sorted Orders ---
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];
        const modifier = sortOrder === "asc" ? 1 : -1;

        if (aValue < bValue) return -modifier;
        if (aValue > bValue) return modifier;
        return 0;
      });
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  // --- Helpers ---
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const stats = useMemo(
    () => ({
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
      COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
      SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
      TOTAL_VALUE: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    }),
    [orders]
  );

  // --- Actions ---
  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    await updateOrder(id, { status: newStatus });
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            Manage purchase orders and track deliveries
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
            label: "Pending",
            value: stats.PENDING,
            icon: Clock,
            color: "text-yellow-400",
          },
          {
            label: "Processing",
            value: stats.PROCESSING,
            icon: Package,
            color: "text-blue-400",
          },
          {
            label: "Completed",
            value: stats.COMPLETED,
            icon: CheckCircle,
            color: "text-green-400",
          },
          {
            label: "Shipped",
            value: stats.SHIPPED,
            icon: Truck,
            color: "text-purple-400",
          },
          {
            label: "Total Value",
            value: formatCurrency(stats.TOTAL_VALUE),
            icon: TrendingUp,
            color: "text-[#B6F400]",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1C2333] border-gray-700">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
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
            placeholder="Search orders, suppliers, or warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1C2333] border-gray-600 text-white"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as OrderStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-48 bg-[#1C2333] border-gray-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1C2333] border-gray-600">
            {[
              "all",
              "PENDING",
              "PROCESSING",
              "COMPLETED",
              "CANCELLED",
              "SHIPPED",
            ].map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="text-white hover:bg-[#2C3444]"
              >
                {status === "all" ? "All Status" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  {searchTerm || statusFilter !== "all"
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
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Supplier</TableHead>
                      <TableHead className="text-gray-300">Warehouse</TableHead>
                      <TableHead className="text-gray-300">Items</TableHead>
                      <TableHead className="text-gray-300 text-right">
                        Total
                      </TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300 text-center">
                        Actions
                      </TableHead>
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
                                by {order.createdById}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-auto p-2 font-medium",
                                    statusColors[order.status as OrderStatus]
                                  )}
                                >
                                  <StatusIcon
                                    status={order.status as OrderStatus}
                                    className="w-3 h-3 mr-1"
                                  />
                                  {order.status}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#1C2333] border-gray-600">
                                {(
                                  [
                                    "PENDING",
                                    "PROCESSING",
                                    "COMPLETED",
                                    "CANCELLED",
                                    "SHIPPED",
                                  ] as OrderStatus[]
                                ).map((status) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() =>
                                      handleStatusChange(order.id, status)
                                    }
                                    className="text-white hover:bg-[#2C3444]"
                                  >
                                    <StatusIcon
                                      status={status}
                                      className="w-4 h-4 mr-2"
                                    />
                                    {status}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>
                            <p className="text-white font-medium">
                              {order.supplierName}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-300">
                              {order.warehouseName}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-gray-400 border-gray-600"
                            >
                              {order.itemCount} items
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="text-white font-semibold">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-400 text-sm">
                              {formatDate(order.createdAt)}
                            </p>
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
                                  onClick={() =>
                                    router.push(`/orders/${order.id}`)
                                  }
                                  className="text-white hover:bg-[#2C3444]"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/orders/${order.id}/edit`)
                                  }
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
