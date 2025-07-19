"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  Building2,
  Warehouse,
  Calendar,
  Tag,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  FileText,
} from "lucide-react"

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)

  // Mock data - in real app, this would be fetched based on productId
  const product = {
    id: productId,
    name: "Wireless Headphones Pro",
    description:
      "Premium noise-canceling wireless headphones with 30-hour battery life and superior sound quality. Features advanced Bluetooth 5.0 connectivity and comfortable over-ear design.",
    sku: "WHP-001",
    price: 199.99,
    quantity: 150,
    minStock: 50,
    category: "Electronics",
    supplier: { id: 1, name: "TechCorp Solutions", email: "contact@techcorp.com" },
    warehouse: { id: 1, name: "Main Warehouse", location: "New York, NY" },
    status: "Active",
    createdAt: "2023-11-15",
    lastUpdated: "2023-12-10",
    totalValue: 29998.5, // price * quantity
  }

  const stockMovements = [
    {
      id: 1,
      date: "2023-12-10",
      type: "Inbound",
      quantity: 50,
      reason: "Purchase Order PO-2023-1001",
      user: "John Doe",
      balanceAfter: 150,
    },
    {
      id: 2,
      date: "2023-12-08",
      type: "Outbound",
      quantity: -25,
      reason: "Sales Order SO-2023-0892",
      user: "Jane Smith",
      balanceAfter: 100,
    },
    {
      id: 3,
      date: "2023-12-05",
      type: "Transfer",
      quantity: 20,
      reason: "Transfer from West Coast Hub",
      user: "Mike Johnson",
      balanceAfter: 125,
    },
    {
      id: 4,
      date: "2023-12-01",
      type: "Adjustment",
      quantity: -5,
      reason: "Inventory count adjustment",
      user: "Sarah Wilson",
      balanceAfter: 105,
    },
    {
      id: 5,
      date: "2023-11-28",
      type: "Outbound",
      quantity: -30,
      reason: "Sales Order SO-2023-0856",
      user: "Jane Smith",
      balanceAfter: 110,
    },
  ]

  const relatedProducts = [
    {
      id: 2,
      name: "Wireless Mouse",
      sku: "WM-006",
      price: 29.99,
      quantity: 300,
      supplier: "TechCorp Solutions",
    },
    {
      id: 3,
      name: "USB-C Hub",
      sku: "UCH-008",
      price: 49.99,
      quantity: 0,
      supplier: "TechCorp Solutions",
    },
    {
      id: 4,
      name: "Bluetooth Speaker Mini",
      sku: "BSM-004",
      price: 59.99,
      quantity: 200,
      supplier: "Global Electronics",
    },
  ]

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { status: "Out of Stock", color: "bg-red-500" }
    if (quantity <= minStock * 0.5) return { status: "Critical", color: "bg-orange-500" }
    if (quantity <= minStock) return { status: "Low Stock", color: "bg-yellow-500" }
    return { status: "In Stock", color: "bg-green-500" }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "Inbound":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "Outbound":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "Transfer":
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />
      case "Adjustment":
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const stockStatus = getStockStatus(product.quantity, product.minStock)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-white">{product.name}</h1>
            <p className="text-gray-400 font-mono">{product.sku}</p>
          </div>
          <Badge className={`${stockStatus.color} text-white`}>{stockStatus.status}</Badge>
        </div>
        <Link href={`/products/${product.id}/edit`}>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                    <p className="text-gray-300">{product.description}</p>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Tag className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{product.category}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Building2 className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{product.supplier.name}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Warehouse className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{product.warehouse.name}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <div>
                      <p className="text-sm">Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm">Updated: {new Date(product.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {product.quantity <= product.minStock && (
                    <div className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-yellow-500 text-sm font-medium">Low Stock Alert</p>
                        <p className="text-yellow-400 text-xs">
                          Current stock ({product.quantity}) is at or below minimum level ({product.minStock})
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Stock Information */}
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">{product.quantity}</div>
                <p className="text-sm text-gray-400">Current Stock</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Minimum Stock:</span>
                  <span className="text-white">{product.minStock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available:</span>
                  <span className="text-white">{product.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reserved:</span>
                  <span className="text-white">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-white">Financial</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unit Price:</span>
                  <span className="text-white">${product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-white font-medium">${product.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stock Movements and Related Products */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="p-6">
          <Tabs defaultValue="movements" className="w-full">
            <TabsList className="bg-[#2C3444] border-none">
              <TabsTrigger
                value="movements"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Stock Movements ({stockMovements.length})
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Related Products ({relatedProducts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movements" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2C3444]">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Quantity</TableHead>
                    <TableHead className="text-gray-300">Reason</TableHead>
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Balance After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id} className="border-[#2C3444]">
                      <TableCell className="text-gray-300">{movement.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getMovementIcon(movement.type)}
                          <span className="ml-2 text-gray-300">{movement.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${movement.quantity > 0 ? "text-green-500" : "text-red-500"}`}>
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity}
                      </TableCell>
                      <TableCell className="text-gray-300">{movement.reason}</TableCell>
                      <TableCell className="text-gray-300">{movement.user}</TableCell>
                      <TableCell className="text-white font-medium">{movement.balanceAfter}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="related" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2C3444]">
                    <TableHead className="text-gray-300">Product</TableHead>
                    <TableHead className="text-gray-300">SKU</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">Stock</TableHead>
                    <TableHead className="text-gray-300">Supplier</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedProducts.map((relatedProduct) => (
                    <TableRow key={relatedProduct.id} className="border-[#2C3444]">
                      <TableCell className="font-medium text-white">{relatedProduct.name}</TableCell>
                      <TableCell className="text-gray-300 font-mono">{relatedProduct.sku}</TableCell>
                      <TableCell className="text-gray-300">${relatedProduct.price}</TableCell>
                      <TableCell className="text-gray-300">{relatedProduct.quantity}</TableCell>
                      <TableCell className="text-gray-300">{relatedProduct.supplier}</TableCell>
                      <TableCell>
                        <Link href={`/products/${relatedProduct.id}`}>
                          <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
