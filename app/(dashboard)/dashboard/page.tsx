"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  QrCode,
  Repeat,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Warehouse,
  ShoppingCart,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MapPin,
  Zap,
  Target,
  PieChart,
  LineChart,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import InventoryHeatmap from "@/components/InventoryHeatmap"
import InteractiveTimeline from "@/components/InteractiveTimeline"
import AdvancedCalculator from "@/components/AdvancedCalculator"
import PredictiveAnalytics from "@/components/PredictiveAnalytics"

export default function Dashboard() {
  // Mock real-time data
  const dashboardData = {
    overview: {
      totalProducts: 1247,
      totalSuppliers: 23,
      totalWarehouses: 8,
      totalUsers: 45,
      totalValue: 2847650,
      monthlyGrowth: 12.5,
      lowStockAlerts: 18,
      criticalAlerts: 5,
      outOfStock: 3,
      pendingOrders: 24,
    },
    recentActivity: [
      {
        id: 1,
        type: "stock_in",
        message: "150 units of Wireless Headphones Pro received",
        time: "2 minutes ago",
        user: "John Doe",
        icon: TrendingUp,
        color: "text-green-500",
      },
      {
        id: 2,
        type: "low_stock",
        message: "LED Desk Lamp is running low (12 units remaining)",
        time: "5 minutes ago",
        user: "System",
        icon: AlertTriangle,
        color: "text-yellow-500",
      },
      {
        id: 3,
        type: "new_supplier",
        message: "New supplier 'Premium Electronics' added",
        time: "15 minutes ago",
        user: "Sarah Wilson",
        icon: Building2,
        color: "text-blue-500",
      },
      {
        id: 4,
        type: "stock_out",
        message: "25 units of Office Chair shipped to customer",
        time: "23 minutes ago",
        user: "Mike Johnson",
        icon: TrendingDown,
        color: "text-red-500",
      },
      {
        id: 5,
        type: "transfer",
        message: "Product transfer completed: Main → West Coast Hub",
        time: "1 hour ago",
        user: "Jane Smith",
        icon: Repeat,
        color: "text-purple-500",
      },
    ],
    topProducts: [
      {
        id: 1,
        name: "Wireless Headphones Pro",
        sku: "WHP-001",
        sales: 245,
        revenue: 48975,
        trend: 15.2,
        stock: 150,
        image: "/placeholder.svg?height=40&width=40&text=WH",
      },
      {
        id: 2,
        name: "Bluetooth Speaker Mini",
        sku: "BSM-004",
        sales: 189,
        revenue: 11334,
        trend: 8.7,
        stock: 200,
        image: "/placeholder.svg?height=40&width=40&text=BS",
      },
      {
        id: 3,
        name: "Ergonomic Office Chair",
        sku: "EOC-002",
        sales: 67,
        revenue: 23449,
        trend: -3.2,
        stock: 25,
        image: "/placeholder.svg?height=40&width=40&text=OC",
      },
      {
        id: 4,
        name: "Adjustable Laptop Stand",
        sku: "ALS-003",
        sales: 134,
        revenue: 10719,
        trend: 22.1,
        stock: 75,
        image: "/placeholder.svg?height=40&width=40&text=LS",
      },
    ],
    warehouseStatus: [
      {
        id: 1,
        name: "Main Warehouse",
        location: "New York, NY",
        capacity: 85,
        items: 12450,
        value: 1245000,
        status: "High",
        alerts: 3,
      },
      {
        id: 2,
        name: "West Coast Hub",
        location: "Los Angeles, CA",
        capacity: 72,
        items: 8930,
        value: 893000,
        status: "Normal",
        alerts: 1,
      },
      {
        id: 3,
        name: "Central Distribution",
        location: "Chicago, IL",
        capacity: 91,
        items: 15670,
        value: 1567000,
        status: "Critical",
        alerts: 8,
      },
      {
        id: 4,
        name: "Southeast Facility",
        location: "Atlanta, GA",
        capacity: 68,
        items: 7820,
        value: 782000,
        status: "Normal",
        alerts: 0,
      },
    ],
    supplierPerformance: [
      {
        id: 1,
        name: "TechCorp Solutions",
        orders: 45,
        onTime: 96,
        rating: 4.8,
        value: 567000,
        products: 23,
      },
      {
        id: 2,
        name: "Global Electronics",
        orders: 38,
        onTime: 94,
        rating: 4.9,
        value: 445000,
        products: 18,
      },
      {
        id: 3,
        name: "FurniMax Industries",
        orders: 22,
        onTime: 89,
        rating: 4.5,
        value: 234000,
        products: 12,
      },
    ],
    monthlyTrends: {
      revenue: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 85000],
      orders: [120, 135, 128, 156, 142, 168, 175, 162, 189, 195, 187, 203],
      inventory: [2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.8, 2.6, 2.9, 3.1, 2.9, 3.2],
    },
  }

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return "bg-red-500"
    if (capacity >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-yellow-500"
      case "Normal":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your inventory today.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <QrCode className="mr-2 h-4 w-4" />
            Quick Scan
          </Button>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Repeat className="mr-2 h-4 w-4" />
            Transfer Stock
          </Button>
          <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent">
            <BarChart className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Products</p>
                  <p className="text-3xl font-bold text-white">
                    {dashboardData.overview.totalProducts.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{dashboardData.overview.monthlyGrowth}%</span>
                    <span className="text-sm text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="bg-[#B6F400]/10 p-3 rounded-full">
                  <Package className="h-8 w-8 text-[#B6F400]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Value</p>
                  <p className="text-3xl font-bold text-white">
                    ${(dashboardData.overview.totalValue / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+8.2%</span>
                    <span className="text-sm text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Alerts</p>
                  <p className="text-3xl font-bold text-white">
                    {dashboardData.overview.lowStockAlerts + dashboardData.overview.criticalAlerts}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-red-500">{dashboardData.overview.criticalAlerts} Critical</span>
                    <span className="text-sm text-gray-400 ml-2">
                      {dashboardData.overview.lowStockAlerts} Low Stock
                    </span>
                  </div>
                </div>
                <div className="bg-red-500/10 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending Orders</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.overview.pendingOrders}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-500">12 Due Today</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <InventoryHeatmap />
        <InteractiveTimeline />
      </div>

      {/* Predictive Analytics */}
      <PredictiveAnalytics />

      {/* Advanced Calculator */}
      <AdvancedCalculator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="bg-[#1C2333] border-none shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-[#2C3444] rounded-lg"
                >
                  <div className={`p-2 rounded-full bg-gray-800`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">{activity.time}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link href="/reports">
                <Button variant="ghost" className="w-full text-[#B6F400] hover:bg-[#2C3444]">
                  View All Activity
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts and Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <LineChart className="mr-2 h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="bg-[#2C3444] border-none mb-6">
                  <TabsTrigger
                    value="revenue"
                    className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
                  >
                    Revenue Trend
                  </TabsTrigger>
                  <TabsTrigger
                    value="inventory"
                    className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
                  >
                    Inventory Turnover
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
                  >
                    Order Volume
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-[#B6F400] mx-auto mb-2" />
                      <p className="text-white font-medium">Monthly Revenue: $85K</p>
                      <p className="text-gray-400 text-sm">+15.2% from last month</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Repeat className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-white font-medium">Turnover Rate: 3.2x</p>
                      <p className="text-gray-400 text-sm">Optimal range achieved</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <ShoppingCart className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                      <p className="text-white font-medium">Monthly Orders: 203</p>
                      <p className="text-gray-400 text-sm">+8.7% from last month</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Products and Warehouse Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#B6F400] flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Top Products
                </CardTitle>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                    View All
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 bg-[#2C3444] rounded-lg"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg bg-[#B6F400]/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sku}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-300">{product.sales} sold</span>
                      <span className="text-xs text-gray-400 mx-2">•</span>
                      <span className="text-xs text-gray-300">${product.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${product.trend > 0 ? "text-green-500" : "text-red-500"}`}>
                      {product.trend > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      <span className="text-xs font-medium">{Math.abs(product.trend)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{product.stock} in stock</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Warehouse Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#B6F400] flex items-center">
                  <Warehouse className="mr-2 h-5 w-5" />
                  Warehouse Status
                </CardTitle>
                <Link href="/warehouses">
                  <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                    View All
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.warehouseStatus.map((warehouse, index) => (
                <motion.div
                  key={warehouse.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  className="p-4 bg-[#2C3444] rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">{warehouse.name}</h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {warehouse.location}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(warehouse.status)} text-white text-xs`}>
                        {warehouse.status}
                      </Badge>
                      {warehouse.alerts > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">{warehouse.alerts} alerts</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Capacity</span>
                      <span className="text-white">{warehouse.capacity}%</span>
                    </div>
                    <Progress value={warehouse.capacity} className="h-2 bg-gray-700" />

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-400">Items</p>
                        <p className="text-sm font-medium text-white">{warehouse.items.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Value</p>
                        <p className="text-sm font-medium text-white">${(warehouse.value / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Supplier Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card className="bg-[#1C2333] border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#B6F400] flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Top Supplier Performance
              </CardTitle>
              <Link href="/suppliers">
                <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                  View All Suppliers
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.supplierPerformance.map((supplier, index) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                  className="p-4 bg-[#2C3444] rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white">{supplier.name}</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-white">{supplier.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Orders</span>
                      <span className="text-xs text-white">{supplier.orders}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">On-Time Delivery</span>
                      <span className="text-xs text-green-500">{supplier.onTime}%</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Total Value</span>
                      <span className="text-xs text-white">${(supplier.value / 1000).toFixed(0)}K</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Products</span>
                      <span className="text-xs text-white">{supplier.products}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <Card className="bg-[#1C2333] border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#B6F400] flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link href="/products/new">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-20 flex flex-col">
                  <Package className="h-6 w-6 mb-2" />
                  <span className="text-xs">Add Product</span>
                </Button>
              </Link>

              <Link href="/suppliers/new">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-20 flex flex-col">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span className="text-xs">Add Supplier</span>
                </Button>
              </Link>

              <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-20 flex flex-col">
                <QrCode className="h-6 w-6 mb-2" />
                <span className="text-xs">Scan Barcode</span>
              </Button>

              <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-20 flex flex-col">
                <Repeat className="h-6 w-6 mb-2" />
                <span className="text-xs">Transfer Stock</span>
              </Button>

              <Link href="/reports">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-20 flex flex-col">
                  <PieChart className="h-6 w-6 mb-2" />
                  <span className="text-xs">View Reports</span>
                </Button>
              </Link>

              <Link href="/inventory">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-20 flex flex-col">
                  <Target className="h-6 w-6 mb-2" />
                  <span className="text-xs">Adjust Stock</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
