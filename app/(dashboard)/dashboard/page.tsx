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
  Users,
  FileText,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Bell,
  CheckCircle,
  XCircle,
  MinusCircle,
  Eye,
  Settings,
  Search,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function OptimizedDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Enhanced dashboard data with more realistic current metrics
  const dashboardData = {
    overview: {
      totalProducts: 1247,
      activeProducts: 1189,
      totalSuppliers: 23,
      totalWarehouses: 8,
      totalUsers: 45,
      totalValue: 2847650,
      monthlyGrowth: 12.5,
      lowStockAlerts: 18,
      criticalAlerts: 5,
      outOfStock: 3,
      pendingOrders: 24,
      completedOrdersToday: 67,
      averageOrderValue: 1250,
      inventoryTurnover: 3.2,
      stockAccuracy: 98.5,
    },
    alerts: {
      urgent: [
        { id: 1, type: "critical", message: "3 products completely out of stock", count: 3 },
        { id: 2, type: "warning", message: "5 products below minimum threshold", count: 5 },
        { id: 3, type: "info", message: "12 products approaching reorder point", count: 12 },
      ]
    },
    recentActivity: [
      {
        id: 1,
        type: "stock_in",
        message: "150 units of Wireless Headphones Pro received from TechCorp Solutions",
        time: "2 minutes ago",
        user: "John Doe",
        icon: TrendingUp,
        color: "text-green-500",
        value: "+$29,850"
      },
      {
        id: 2,
        type: "low_stock",
        message: "LED Desk Lamp critically low - 12 units remaining (Min: 50)",
        time: "5 minutes ago",
        user: "System Alert",
        icon: AlertTriangle,
        color: "text-red-500",
        priority: "high"
      },
      {
        id: 3,
        type: "order_completed",
        message: "Order #ORD-2024-1056 shipped - 25 Office Chairs to ClientCorp",
        time: "12 minutes ago",
        user: "Sarah Wilson",
        icon: CheckCircle,
        color: "text-blue-500",
        value: "$8,750"
      },
      {
        id: 4,
        type: "new_supplier",
        message: "Supplier verification completed: Premium Electronics Ltd.",
        time: "15 minutes ago",
        user: "Mike Johnson",
        icon: Building2,
        color: "text-purple-500",
        status: "verified"
      },
      {
        id: 5,
        type: "transfer",
        message: "Stock transfer completed: 200 units Main → West Coast Hub",
        time: "23 minutes ago",
        user: "Jane Smith",
        icon: Repeat,
        color: "text-indigo-500",
        items: "200 units"
      },
    ],
    topProducts: [
      {
        id: 1,
        name: "Wireless Headphones Pro",
        sku: "WHP-001",
        category: "Electronics",
        sales: 245,
        revenue: 48975,
        trend: 15.2,
        stock: 150,
        reorderPoint: 50,
        status: "healthy",
        profit: 14692.5,
        velocity: "high",
        image: "/placeholder.svg?height=40&width=40&text=WH"
      },
      {
        id: 2,
        name: "Bluetooth Speaker Mini",
        sku: "BSM-004",
        category: "Electronics",
        sales: 189,
        revenue: 11334,
        trend: 8.7,
        stock: 25,
        reorderPoint: 30,
        status: "warning",
        profit: 3400,
        velocity: "medium",
        image: "/placeholder.svg?height=40&width=40&text=BS"
      },
      {
        id: 3,
        name: "Ergonomic Office Chair",
        sku: "EOC-002",
        category: "Furniture",
        sales: 67,
        revenue: 23449,
        trend: -3.2,
        stock: 25,
        reorderPoint: 15,
        status: "healthy",
        profit: 7034,
        velocity: "low",
        image: "/placeholder.svg?height=40&width=40&text=OC"
      },
      {
        id: 4,
        name: "Adjustable Laptop Stand",
        sku: "ALS-003",
        category: "Accessories",
        sales: 134,
        revenue: 10719,
        trend: 22.1,
        stock: 75,
        reorderPoint: 25,
        status: "healthy",
        profit: 4287,
        velocity: "high",
        image: "/placeholder.svg?height=40&width=40&text=LS"
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
        efficiency: 94,
        lastUpdated: "5 min ago"
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
        efficiency: 97,
        lastUpdated: "2 min ago"
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
        efficiency: 89,
        lastUpdated: "1 min ago"
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
        efficiency: 96,
        lastUpdated: "3 min ago"
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
        lastOrder: "2 days ago",
        leadTime: 7,
        defectRate: 0.5
      },
      {
        id: 2,
        name: "Global Electronics",
        orders: 38,
        onTime: 94,
        rating: 4.9,
        value: 445000,
        products: 18,
        lastOrder: "1 day ago",
        leadTime: 5,
        defectRate: 0.2
      },
      {
        id: 3,
        name: "FurniMax Industries",
        orders: 22,
        onTime: 89,
        rating: 4.5,
        value: 234000,
        products: 12,
        lastOrder: "5 days ago",
        leadTime: 14,
        defectRate: 1.1
      },
    ],
    monthlyTrends: {
      revenue: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 85000],
      orders: [120, 135, 128, 156, 142, 168, 175, 162, 189, 195, 187, 203],
      inventory: [2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.8, 2.6, 2.9, 3.1, 2.9, 3.2],
    },
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical": return "bg-red-500 text-white"
      case "high": return "bg-orange-500 text-white"
      case "warning": return "bg-yellow-500 text-black"
      case "normal": return "bg-green-500 text-white"
      case "healthy": return "bg-green-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case "high": return "text-green-500"
      case "medium": return "text-yellow-500"
      case "low": return "text-red-500"
      default: return "text-gray-500"
    }
  }

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return "bg-red-500"
    if (capacity >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6 space-y-8">
      {/* Enhanced Header with Real-time Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-[#B6F400] to-[#9ED900] bg-clip-text text-transparent">
              Inventory Dashboard
            </h1>
            <p className="text-gray-400">
              Last updated: {currentTime.toLocaleTimeString()} • Welcome back, Admin
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline" 
            className="border-[#2C3444] text-gray-400 hover:bg-[#2C3444]"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900] font-medium">
            <QrCode className="mr-2 h-4 w-4" />
            Quick Scan
          </Button>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900] font-medium">
            <Repeat className="mr-2 h-4 w-4" />
            Transfer Stock
          </Button>
          <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent relative">
            <Bell className="h-4 w-4" />
            {(dashboardData.overview.criticalAlerts + dashboardData.overview.lowStockAlerts) > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {dashboardData.overview.criticalAlerts + dashboardData.overview.lowStockAlerts}
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Critical Alerts Banner */}
      {dashboardData.overview.criticalAlerts > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-red-500/10 border-red-500/20 border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="text-red-400 font-medium">Critical Stock Alerts</h3>
                    <p className="text-red-300 text-sm">
                      {dashboardData.overview.criticalAlerts} items need immediate attention
                    </p>
                  </div>
                </div>
                <Button size="sm" className="bg-red-500 text-white hover:bg-red-600">
                  <Eye className="mr-2 h-4 w-4" />
                  Review Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Inventory Value",
            value: `$${(dashboardData.overview.totalValue / 1000000).toFixed(2)}M`,
            change: `+${dashboardData.overview.monthlyGrowth}%`,
            subtitle: `Stock Accuracy: ${dashboardData.overview.stockAccuracy}%`,
            icon: DollarSign,
            iconColor: "text-[#B6F400]",
            bgColor: "bg-[#B6F400]/20"
          },
          {
            title: "Active Products",
            value: dashboardData.overview.activeProducts.toLocaleString(),
            change: `${dashboardData.overview.totalProducts - dashboardData.overview.activeProducts} inactive`,
            subtitle: `Turnover: ${dashboardData.overview.inventoryTurnover}x`,
            icon: Package,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-500/20"
          },
          {
            title: "Stock Alerts",
            value: (dashboardData.overview.lowStockAlerts + dashboardData.overview.criticalAlerts).toString(),
            change: `${dashboardData.overview.criticalAlerts} Critical • ${dashboardData.overview.lowStockAlerts} Low`,
            subtitle: `${dashboardData.overview.outOfStock} out of stock`,
            icon: AlertTriangle,
            iconColor: "text-red-500",
            bgColor: "bg-red-500/20"
          },
          {
            title: "Today's Orders",
            value: dashboardData.overview.completedOrdersToday.toString(),
            change: `$${(dashboardData.overview.completedOrdersToday * dashboardData.overview.averageOrderValue / 1000).toFixed(0)}K revenue`,
            subtitle: `${dashboardData.overview.pendingOrders} pending`,
            icon: ShoppingCart,
            iconColor: "text-green-500",
            bgColor: "bg-green-500/20"
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#1C2333] to-[#2C3444] border-none shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-green-500">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{metric.change}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{metric.subtitle}</p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-full`}>
                    <metric.icon className={`h-8 w-8 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="bg-[#1C2333] border-none shadow-lg h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#B6F400] flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Live Activity Feed
                </CardTitle>
                <Badge className="bg-green-500/20 text-green-400 text-xs">LIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-[#2C3444] rounded-lg hover:bg-[#3C4454] transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-full bg-gray-800/50`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm text-white leading-tight">{activity.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{activity.time}</span>
                      {activity.value && (
                        <span className="text-xs text-[#B6F400] font-medium">{activity.value}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      {activity.priority && (
                        <Badge className="bg-red-500/20 text-red-400 text-xs">
                          {activity.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link href="/reports">
                <Button variant="ghost" className="w-full text-[#B6F400] hover:bg-[#2C3444] mt-4">
                  View All Activity
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Performance Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-[#1C2333] border-none shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#B6F400] flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-[#2C3444] text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last 30 days
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#2C3444] text-gray-400">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="bg-[#2C3444] border-none mb-6 w-full">
                  <TabsTrigger
                    value="revenue"
                    className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A] flex-1"
                  >
                    Revenue Trends
                  </TabsTrigger>
                  <TabsTrigger
                    value="inventory"
                    className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A] flex-1"
                  >
                    Stock Movement
                  </TabsTrigger>
                  <TabsTrigger
                    value="efficiency"
                    className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A] flex-1"
                  >
                    Efficiency
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">This Month</p>
                      <p className="text-lg font-bold text-white">$847K</p>
                      <p className="text-xs text-green-500">+15.2%</p>
                    </div>
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Avg Order</p>
                      <p className="text-lg font-bold text-white">${dashboardData.overview.averageOrderValue}</p>
                      <p className="text-xs text-blue-500">+3.1%</p>
                    </div>
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Profit Margin</p>
                      <p className="text-lg font-bold text-white">24.5%</p>
                      <p className="text-xs text-yellow-500">-1.2%</p>
                    </div>
                  </div>
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-[#B6F400] mx-auto mb-2" />
                      <p className="text-white font-medium">Revenue Growth: +15.2%</p>
                      <p className="text-gray-400 text-sm">Exceeding targets by 8.3%</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Turnover Rate</p>
                      <p className="text-lg font-bold text-white">{dashboardData.overview.inventoryTurnover}x</p>
                      <p className="text-xs text-green-500">Optimal</p>
                    </div>
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Stock Days</p>
                      <p className="text-lg font-bold text-white">45 days</p>
                      <p className="text-xs text-blue-500">-3 days</p>
                    </div>
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Fill Rate</p>
                      <p className="text-lg font-bold text-white">97.2%</p>
                      <p className="text-xs text-green-500">+0.8%</p>
                    </div>
                  </div>
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Repeat className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-white font-medium">Healthy Stock Flow</p>
                      <p className="text-gray-400 text-sm">Optimized inventory levels maintained</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="efficiency" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Order Accuracy</p>
                      <p className="text-lg font-bold text-white">99.1%</p>
                      <p className="text-xs text-green-500">+0.3%</p>
                    </div>
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Fulfillment Time</p>
                      <p className="text-lg font-bold text-white">2.1 hrs</p>
                      <p className="text-xs text-green-500">-0.4 hrs</p>
                    </div>
                    <div className="bg-[#2C3444] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Cost per Order</p>
                      <p className="text-lg font-bold text-white">$12.50</p>
                      <p className="text-xs text-yellow-500">+$0.20</p>
                    </div>
                  </div>
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Zap className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                      <p className="text-white font-medium">High Efficiency</p>
                      <p className="text-gray-400 text-sm">Operations running smoothly</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  Top Performing Products
                </CardTitle>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                    <Search className="mr-2 h-4 w-4" />
                    View All
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
                  className="flex items-center space-x-4 p-4 bg-[#2C3444] rounded-lg hover:bg-[#3C4454] transition-colors cursor-pointer"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#B6F400]/20 to-[#9ED900]/20 flex items-center justify-center"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{product.sku}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                      <span>•</span>
                      <span className={getVelocityColor(product.velocity)}>{product.velocity} velocity</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-gray-400">Sales</p>
                        <p className="text-sm font-medium text-white">{product.sales}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Revenue</p>
                        <p className="text-sm font-medium text-white">${(product.revenue / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Stock</p>
                        <p className="text-sm font-medium text-white">{product.stock}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className={`flex items-center ${product.trend > 0 ? "text-green-500" : "text-red-500"}`}>
                      {product.trend > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      <span className="text-xs font-medium">{Math.abs(product.trend)}%</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Profit: ${(product.profit / 1000).toFixed(1)}K
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Warehouse Status */}
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
                  Warehouse Operations
                </CardTitle>
                <Link href="/warehouses">
                  <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
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
                  className="p-4 bg-[#2C3444] rounded-lg hover:bg-[#3C4454] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">{warehouse.name}</h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {warehouse.location}
                        <span className="mx-2">•</span>
                        <span>Updated {warehouse.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(warehouse.status)}>
                        {warehouse.status}
                      </Badge>
                      {warehouse.alerts > 0 && (
                        <Badge className="bg-red-500/20 text-red-400 text-xs">
                          {warehouse.alerts} alerts
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Capacity Utilization</span>
                        <span className="text-white">{warehouse.capacity}%</span>
                      </div>
                      <Progress 
                        value={warehouse.capacity} 
                        className={`h-2 bg-gray-700 ${getCapacityColor(warehouse.capacity)}`}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Items</p>
                        <p className="text-sm font-medium text-white">{warehouse.items.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Value</p>
                        <p className="text-sm font-medium text-white">${(warehouse.value / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Efficiency</p>
                        <p className="text-sm font-medium text-green-400">{warehouse.efficiency}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Supplier Performance */}
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
                Supplier Performance Dashboard
              </CardTitle>
              <div className="flex space-x-2">
                <Link href="/suppliers">
                  <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                    <Users className="mr-2 h-4 w-4" />
                    All Suppliers
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </div>
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
                  className="p-4 bg-[#2C3444] rounded-lg hover:bg-[#3C4454] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-white">{supplier.name}</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-white">{supplier.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Orders Completed</span>
                      <span className="text-xs text-white font-medium">{supplier.orders}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">On-Time Delivery</span>
                      <span className={`text-xs font-medium ${supplier.onTime >= 95 ? 'text-green-500' : supplier.onTime >= 90 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {supplier.onTime}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Lead Time</span>
                      <span className="text-xs text-white font-medium">{supplier.leadTime} days</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Defect Rate</span>
                      <span className={`text-xs font-medium ${supplier.defectRate <= 0.5 ? 'text-green-500' : supplier.defectRate <= 1.0 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {supplier.defectRate}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Total Value</span>
                      <span className="text-xs text-white font-medium">${(supplier.value / 1000).toFixed(0)}K</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Last Order</span>
                      <span className="text-xs text-gray-300">{supplier.lastOrder}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Active Products</span>
                        <span className="text-xs text-[#B6F400] font-medium">{supplier.products}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <Card className="bg-[#1C2333] border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#B6F400] flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Quick Actions & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link href="/products/new">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-24 flex flex-col transition-all duration-300 hover:scale-105">
                  <Package className="h-6 w-6 mb-2" />
                  <span className="text-xs">Add Product</span>
                </Button>
              </Link>

              <Link href="/suppliers/new">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-24 flex flex-col transition-all duration-300 hover:scale-105">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span className="text-xs">New Supplier</span>
                </Button>
              </Link>

              <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-24 flex flex-col transition-all duration-300 hover:scale-105">
                <QrCode className="h-6 w-6 mb-2" />
                <span className="text-xs">Scan Barcode</span>
              </Button>

              <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-24 flex flex-col transition-all duration-300 hover:scale-105">
                <Repeat className="h-6 w-6 mb-2" />
                <span className="text-xs">Transfer Stock</span>
              </Button>

              <Link href="/reports">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-24 flex flex-col transition-all duration-300 hover:scale-105">
                  <PieChart className="h-6 w-6 mb-2" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </Link>

              <Link href="/inventory">
                <Button className="w-full bg-[#2C3444] text-white hover:bg-[#3C4454] h-24 flex flex-col transition-all duration-300 hover:scale-105">
                  <Target className="h-6 w-6 mb-2" />
                  <span className="text-xs">Stock Audit</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}