"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Order {
  id: number
  orderNumber: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  supplierName: string
  warehouseName: string
  totalAmount: number
  itemCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
}

const statusIcons = {
  PENDING: Clock,
  PROCESSING: Package,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
}

// Mock data - replace with actual API calls
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    status: "PROCESSING",
    supplierName: "TechCorp Solutions",
    warehouseName: "Main Warehouse",
    totalAmount: 1248.62,
    itemCount: 4,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    createdBy: "John Doe",
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    status: "PENDING",
    supplierName: "Global Electronics",
    warehouseName: "West Coast Hub",
    totalAmount: 2156.89,
    itemCount: 7,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    createdBy: "Jane Smith",
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    status: "COMPLETED",
    supplierName: "Industrial Supplies Co",
    warehouseName: "Central Distribution",
    totalAmount: 3421.45,
    itemCount: 12,
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-14T11:30:00Z",
    createdBy: "Mike Johnson",
  },
  {
    id: 4,
    orderNumber: "ORD-2024-004",
    status: "CANCELLED",
    supplierName: "Premium Parts Ltd",
    warehouseName: "Main Warehouse",
    totalAmount: 892.33,
    itemCount: 3,
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-13T08:45:00Z",
    createdBy: "Sarah Wilson",
  },
  {
    id: 5,
    orderNumber: "ORD-2024-005",
    status: "PROCESSING",
    supplierName: "TechCorp Solutions",
    warehouseName: "West Coast Hub",
    totalAmount: 1876.21,
    itemCount: 6,
    createdAt: "2024-01-11T11:10:00Z",
    updatedAt: "2024-01-12T15:30:00Z",
    createdBy: "David Brown",
  },
]

export default function OrderListPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Simulate API call
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOrders(mockOrders)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Order]
      const bValue = b[sortBy as keyof Order]
      const modifier = sortOrder === "asc" ? 1 : -1
      return aValue < bValue ? -modifier : aValue > bValue ? modifier : 0
    })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusStats = () => {
    const stats = {
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
      COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    }
    return stats
  }

  const getTotalValue = () => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0)
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      // Update local state immediately for better UX
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus as Order["status"], updatedAt: new Date().toISOString() }
            : order,
        ),
      )
      // API call would go here
      console.log(`Updating order ${orderId} status to ${newStatus}`)
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return
    }

    try {
      setOrders((prev) => prev.filter((order) => order.id !== orderId))
      // API call would go here
      console.log(`Deleting order ${orderId}`)
    } catch (error) {
      console.error("Failed to delete order:", error)
    }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

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
          <p className="text-gray-400 mt-1">Manage purchase orders and track deliveries</p>
        </div>
        <Button
          onClick={() => router.push("/orders/new")}
          className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#A5E000] font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Order
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-[#1C2333] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.PENDING}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2333] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Processing</p>
                <p className="text-2xl font-bold text-blue-400">{stats.PROCESSING}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2333] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.COMPLETED}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2333] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-[#B6F400]">{formatCurrency(getTotalValue())}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#B6F400]" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search orders, suppliers, or warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1C2333] border-gray-600 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-[#1C2333] border-gray-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1C2333] border-gray-600">
            <SelectItem value="all" className="text-white hover:bg-[#2C3444]">
              All Status
            </SelectItem>
            <SelectItem value="PENDING" className="text-white hover:bg-[#2C3444]">
              Pending
            </SelectItem>
            <SelectItem value="PROCESSING" className="text-white hover:bg-[#2C3444]">
              Processing
            </SelectItem>
            <SelectItem value="COMPLETED" className="text-white hover:bg-[#2C3444]">
              Completed
            </SelectItem>
            <SelectItem value="CANCELLED" className="text-white hover:bg-[#2C3444]">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
                      <TableHead className="text-gray-300 text-right">Total</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredOrders.map((order, index) => {
                        const StatusIcon = statusIcons[order.status]
                        return (
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
                                <p className="text-white font-medium">{order.orderNumber}</p>
                                <p className="text-gray-400 text-xs">by {order.createdBy}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn("h-auto p-2 font-medium", statusColors[order.status])}
                                  >
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {order.status}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#1C2333] border-gray-600">
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(order.id, "PENDING")}
                                    className="text-white hover:bg-[#2C3444]"
                                  >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(order.id, "PROCESSING")}
                                    className="text-white hover:bg-[#2C3444]"
                                  >
                                    <Package className="w-4 h-4 mr-2" />
                                    Processing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(order.id, "COMPLETED")}
                                    className="text-white hover:bg-[#2C3444]"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                    className="text-white hover:bg-[#2C3444]"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancelled
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell>
                              <p className="text-white font-medium">{order.supplierName}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-gray-300">{order.warehouseName}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-gray-400 border-gray-600">
                                {order.itemCount} items
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <p className="text-white font-semibold">{formatCurrency(order.totalAmount)}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
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
                                <DropdownMenuContent className="bg-[#1C2333] border-gray-600" align="end">
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
                        )
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
