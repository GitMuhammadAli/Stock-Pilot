"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Thermometer, MapPin, Package, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function InventoryHeatmap() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [hoveredCell, setHoveredCell] = useState<any>(null)

  // Mock heatmap data - represents inventory movement intensity
  const heatmapData = [
    // Warehouses (rows) x Time periods (columns)
    { warehouse: "Main Warehouse", location: "New York", data: [85, 92, 78, 95, 88, 76, 82, 90, 87, 93, 79, 86] },
    { warehouse: "West Coast Hub", location: "Los Angeles", data: [72, 68, 85, 79, 91, 83, 77, 74, 88, 82, 76, 89] },
    { warehouse: "Central Dist.", location: "Chicago", data: [95, 89, 92, 87, 94, 91, 88, 96, 93, 89, 97, 92] },
    { warehouse: "Southeast", location: "Atlanta", data: [68, 74, 71, 83, 77, 69, 85, 78, 72, 80, 75, 84] },
    { warehouse: "Northeast", location: "Boston", data: [81, 87, 84, 79, 86, 92, 88, 83, 90, 85, 87, 91] },
    { warehouse: "Southwest", location: "Phoenix", data: [76, 82, 78, 85, 80, 77, 89, 84, 81, 87, 83, 86] },
  ]

  const timeLabels =
    selectedPeriod === "week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const getIntensityColor = (value: number) => {
    if (value >= 90) return "bg-red-500"
    if (value >= 80) return "bg-orange-500"
    if (value >= 70) return "bg-yellow-500"
    if (value >= 60) return "bg-green-500"
    return "bg-blue-500"
  }

  const getIntensityOpacity = (value: number) => {
    return Math.max(0.3, value / 100)
  }

  return (
    <Card className="bg-[#1C2333] border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#B6F400] flex items-center">
            <Thermometer className="mr-2 h-5 w-5" />
            Inventory Activity Heatmap
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={selectedPeriod === "week" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("week")}
              className={selectedPeriod === "week" ? "bg-[#B6F400] text-[#0B0F1A]" : "border-[#2C3444] text-white"}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={selectedPeriod === "month" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("month")}
              className={selectedPeriod === "month" ? "bg-[#B6F400] text-[#0B0F1A]" : "border-[#2C3444] text-white"}
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time Labels */}
              <div className="grid grid-cols-13 gap-1 mb-2">
                <div></div> {/* Empty cell for warehouse names */}
                {timeLabels.map((label, index) => (
                  <div key={index} className="text-xs text-gray-400 text-center py-1">
                    {label}
                  </div>
                ))}
              </div>

              {/* Heatmap Rows */}
              {heatmapData.map((warehouse, rowIndex) => (
                <motion.div
                  key={warehouse.warehouse}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                  className="grid grid-cols-13 gap-1 mb-1"
                >
                  {/* Warehouse Name */}
                  <div className="flex flex-col justify-center pr-2">
                    <div className="text-sm font-medium text-white truncate">{warehouse.warehouse}</div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {warehouse.location}
                    </div>
                  </div>

                  {/* Activity Cells */}
                  {warehouse.data.map((value, colIndex) => (
                    <motion.div
                      key={colIndex}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: rowIndex * 0.1 + colIndex * 0.02 }}
                      className={`
                        h-12 rounded cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative
                        ${getIntensityColor(value)}
                      `}
                      style={{ opacity: getIntensityOpacity(value) }}
                      onMouseEnter={() =>
                        setHoveredCell({ warehouse: warehouse.warehouse, value, period: timeLabels[colIndex] })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{value}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Activity Level:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-blue-500 opacity-50 rounded"></div>
                  <span className="text-xs text-gray-400">Low</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-500 opacity-70 rounded"></div>
                  <span className="text-xs text-gray-400">Normal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-yellow-500 opacity-80 rounded"></div>
                  <span className="text-xs text-gray-400">High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-orange-500 opacity-90 rounded"></div>
                  <span className="text-xs text-gray-400">Very High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-red-500 opacity-100 rounded"></div>
                  <span className="text-xs text-gray-400">Critical</span>
                </div>
              </div>
            </div>

            {/* Hover Info */}
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#2C3444] p-3 rounded-lg border border-[#3C4454]"
              >
                <div className="text-sm font-medium text-white">{hoveredCell.warehouse}</div>
                <div className="text-xs text-gray-400">
                  {hoveredCell.period}: {hoveredCell.value}% activity
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-[#2C3444] p-4 rounded-lg text-center">
              <Package className="h-6 w-6 text-[#B6F400] mx-auto mb-2" />
              <div className="text-lg font-bold text-white">87%</div>
              <div className="text-xs text-gray-400">Avg Activity</div>
            </div>
            <div className="bg-[#2C3444] p-4 rounded-lg text-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">3</div>
              <div className="text-xs text-gray-400">High Activity Zones</div>
            </div>
            <div className="bg-[#2C3444] p-4 rounded-lg text-center">
              <Thermometer className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">12°</div>
              <div className="text-xs text-gray-400">Activity Range</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
