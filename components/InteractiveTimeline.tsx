"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, TrendingDown, Package, Truck, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function InteractiveTimeline() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const timelineEvents = {
    "24h": [
      {
        id: 1,
        time: "2 min ago",
        type: "stock_in",
        title: "Stock Received",
        description: "150 units of Wireless Headphones Pro",
        value: "+150",
        warehouse: "Main Warehouse",
        user: "John Doe",
        icon: TrendingUp,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        id: 2,
        time: "15 min ago",
        type: "alert",
        title: "Low Stock Alert",
        description: "LED Desk Lamp below minimum threshold",
        value: "12 units",
        warehouse: "Southeast Facility",
        user: "System",
        icon: AlertCircle,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        id: 3,
        time: "1 hour ago",
        type: "stock_out",
        title: "Order Fulfilled",
        description: "25 units of Office Chair shipped",
        value: "-25",
        warehouse: "West Coast Hub",
        user: "Mike Johnson",
        icon: TrendingDown,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        id: 4,
        time: "2 hours ago",
        type: "transfer",
        title: "Stock Transfer",
        description: "Product transfer completed",
        value: "50 units",
        warehouse: "Main → Central",
        user: "Jane Smith",
        icon: Truck,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        id: 5,
        time: "4 hours ago",
        type: "stock_in",
        title: "Purchase Order",
        description: "Bluetooth Speaker Mini restocked",
        value: "+200",
        warehouse: "Central Distribution",
        user: "Sarah Wilson",
        icon: Package,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
    ],
    "7d": [
      {
        id: 6,
        time: "Today",
        type: "stock_in",
        title: "Weekly Restock",
        description: "Multiple products restocked",
        value: "+1,250",
        warehouse: "All Warehouses",
        user: "Automated",
        icon: TrendingUp,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        id: 7,
        time: "2 days ago",
        type: "alert",
        title: "Capacity Warning",
        description: "Central Distribution at 91% capacity",
        value: "91%",
        warehouse: "Central Distribution",
        user: "System",
        icon: AlertCircle,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        id: 8,
        time: "3 days ago",
        type: "stock_out",
        title: "Large Order",
        description: "Bulk order for electronics shipped",
        value: "-500",
        warehouse: "Main Warehouse",
        user: "Order System",
        icon: TrendingDown,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
    ],
    "30d": [
      {
        id: 9,
        time: "This week",
        type: "stock_in",
        title: "Monthly Inventory",
        description: "Major supplier deliveries completed",
        value: "+5,000",
        warehouse: "All Warehouses",
        user: "Supply Chain",
        icon: TrendingUp,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        id: 10,
        time: "2 weeks ago",
        type: "transfer",
        title: "Warehouse Optimization",
        description: "Stock redistribution across facilities",
        value: "2,500 units",
        warehouse: "Multi-location",
        user: "Operations Team",
        icon: Truck,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
    ],
  }

  const currentEvents = timelineEvents[selectedTimeframe as keyof typeof timelineEvents] || []

  return (
    <Card className="bg-[#1C2333] border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#B6F400] flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Activity Timeline
          </CardTitle>
          <div className="flex space-x-2">
            {["24h", "7d", "30d"].map((period) => (
              <Button
                key={period}
                size="sm"
                variant={selectedTimeframe === period ? "default" : "outline"}
                onClick={() => setSelectedTimeframe(period)}
                className={
                  selectedTimeframe === period
                    ? "bg-[#B6F400] text-[#0B0F1A]"
                    : "border-[#2C3444] text-white hover:bg-[#2C3444]"
                }
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2C3444]"></div>

          {/* Timeline Events */}
          <div className="space-y-6">
            {currentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  relative flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedEvent?.id === event.id ? "bg-[#2C3444] border border-[#B6F400]" : "hover:bg-[#2C3444]"}
                `}
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              >
                {/* Timeline Dot */}
                <div
                  className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full
                  ${event.bgColor} border-2 border-[#1C2333]
                `}
                >
                  <event.icon className={`h-5 w-5 ${event.color}`} />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{event.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-[#2C3444] text-gray-400 text-xs">
                        {event.time}
                      </Badge>
                      <span className={`text-sm font-medium ${event.color}`}>{event.value}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{event.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{event.warehouse}</span>
                    <span>by {event.user}</span>
                  </div>

                  {/* Expanded Details */}
                  {selectedEvent?.id === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-3 bg-[#1C2333] rounded-lg border border-[#3C4454]"
                    >
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400">Event Type:</span>
                          <span className="text-white ml-2 capitalize">{event.type.replace("_", " ")}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Impact:</span>
                          <span className={`ml-2 font-medium ${event.color}`}>{event.value}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white ml-2">{event.warehouse}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Initiated by:</span>
                          <span className="text-white ml-2">{event.user}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            <div className="bg-[#2C3444] p-4 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {currentEvents.filter((e) => e.type === "stock_in").length}
              </div>
              <div className="text-xs text-gray-400">Stock In Events</div>
            </div>
            <div className="bg-[#2C3444] p-4 rounded-lg text-center">
              <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {currentEvents.filter((e) => e.type === "stock_out").length}
              </div>
              <div className="text-xs text-gray-400">Stock Out Events</div>
            </div>
            <div className="bg-[#2C3444] p-4 rounded-lg text-center">
              <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {currentEvents.filter((e) => e.type === "alert").length}
              </div>
              <div className="text-xs text-gray-400">Alerts Generated</div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
