"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

export default function InventoryPage() {
  const inventoryItems = [
    {
      id: 1,
      product: "Wireless Headphones",
      sku: "WH-001",
      warehouse: "Main Warehouse",
      currentStock: 150,
      reservedStock: 25,
      availableStock: 125,
      reorderPoint: 50,
      lastMovement: "2023-12-15",
      movementType: "Inbound",
      quantity: 50,
    },
    {
      id: 2,
      product: "Office Chair",
      sku: "OC-002",
      warehouse: "West Coast Hub",
      currentStock: 25,
      reservedStock: 5,
      availableStock: 20,
      reorderPoint: 30,
      lastMovement: "2023-12-14",
      movementType: "Outbound",
      quantity: -10,
    },
    {
      id: 3,
      product: "Laptop Stand",
      sku: "LS-003",
      warehouse: "Central Distribution",
      currentStock: 75,
      reservedStock: 15,
      availableStock: 60,
      reorderPoint: 25,
      lastMovement: "2023-12-13",
      movementType: "Transfer",
      quantity: 20,
    },
    {
      id: 4,
      product: "Bluetooth Speaker",
      sku: "BS-004",
      warehouse: "Main Warehouse",
      currentStock: 200,
      reservedStock: 40,
      availableStock: 160,
      reorderPoint: 75,
      lastMovement: "2023-12-12",
      movementType: "Inbound",
      quantity: 100,
    },
    {
      id: 5,
      product: "Desk Lamp",
      sku: "DL-005",
      warehouse: "Southeast Facility",
      currentStock: 12,
      reservedStock: 2,
      availableStock: 10,
      reorderPoint: 20,
      lastMovement: "2023-12-11",
      movementType: "Outbound",
      quantity: -8,
    },
  ]

  const getStockStatus = (current: number, reorder: number) => {
    if (current <= reorder) return { status: "Reorder", color: "bg-red-500" }
    if (current <= reorder * 1.5) return { status: "Low", color: "bg-yellow-500" }
    return { status: "Good", color: "bg-green-500" }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "Inbound":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "Outbound":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "Transfer":
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.currentStock, 0)
  const totalReserved = inventoryItems.reduce((sum, item) => sum + item.reservedStock, 0)
  const totalAvailable = inventoryItems.reduce((sum, item) => sum + item.availableStock, 0)
  const reorderItems = inventoryItems.filter((item) => item.currentStock <= item.reorderPoint).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Inventory Tracking</h1>
        <div className="flex space-x-2">
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">Transfer Stock</Button>
          <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444]">
            Adjust Inventory
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#B6F400]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Stock</p>
                <p className="text-2xl font-bold text-white">{totalItems.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Available</p>
                <p className="text-2xl font-bold text-white">{totalAvailable.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Reserved</p>
                <p className="text-2xl font-bold text-white">{totalReserved.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Need Reorder</p>
                <p className="text-2xl font-bold text-white">{reorderItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2C3444]">
                <TableHead className="text-gray-300">Product</TableHead>
                <TableHead className="text-gray-300">SKU</TableHead>
                <TableHead className="text-gray-300">Warehouse</TableHead>
                <TableHead className="text-gray-300">Current</TableHead>
                <TableHead className="text-gray-300">Available</TableHead>
                <TableHead className="text-gray-300">Reserved</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Last Movement</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => {
                const stockStatus = getStockStatus(item.currentStock, item.reorderPoint)
                return (
                  <TableRow key={item.id} className="border-[#2C3444]">
                    <TableCell className="font-medium text-white">{item.product}</TableCell>
                    <TableCell className="text-gray-300">{item.sku}</TableCell>
                    <TableCell className="text-gray-300">{item.warehouse}</TableCell>
                    <TableCell className="text-gray-300">{item.currentStock}</TableCell>
                    <TableCell className="text-gray-300">{item.availableStock}</TableCell>
                    <TableCell className="text-gray-300">{item.reservedStock}</TableCell>
                    <TableCell>
                      <Badge className={`${stockStatus.color} text-white`}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getMovementIcon(item.movementType)}
                        <span className="text-gray-300 text-sm">{item.lastMovement}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                          Adjust
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
                          Transfer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
