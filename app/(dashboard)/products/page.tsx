"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Download,
  Building2,
  Warehouse,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("all")
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const { toast } = useToast()

  const products = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      description: "Premium noise-canceling wireless headphones with 30-hour battery life",
      sku: "WHP-001",
      price: 199.99,
      quantity: 150,
      minStock: 50,
      category: "Electronics",
      supplier: { id: 1, name: "TechCorp Solutions" },
      warehouse: { id: 1, name: "Main Warehouse" },
      status: "Active",
      createdAt: "2023-11-15",
      lastUpdated: "2023-12-10",
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      description: "Adjustable height office chair with lumbar support and breathable mesh",
      sku: "EOC-002",
      price: 349.99,
      quantity: 25,
      minStock: 30,
      category: "Furniture",
      supplier: { id: 2, name: "FurniMax Industries" },
      warehouse: { id: 2, name: "West Coast Hub" },
      status: "Low Stock",
      createdAt: "2023-10-20",
      lastUpdated: "2023-12-05",
    },
    {
      id: 3,
      name: "Adjustable Laptop Stand",
      description: "Aluminum laptop stand with adjustable height and angle",
      sku: "ALS-003",
      price: 79.99,
      quantity: 75,
      minStock: 25,
      category: "Accessories",
      supplier: { id: 3, name: "AccessoryPlus Ltd" },
      warehouse: { id: 1, name: "Main Warehouse" },
      status: "Active",
      createdAt: "2023-11-01",
      lastUpdated: "2023-12-12",
    },
    {
      id: 4,
      name: "Bluetooth Speaker Mini",
      description: "Compact portable Bluetooth speaker with 12-hour battery",
      sku: "BSM-004",
      price: 59.99,
      quantity: 200,
      minStock: 75,
      category: "Electronics",
      supplier: { id: 5, name: "Global Electronics" },
      warehouse: { id: 3, name: "Central Distribution" },
      status: "Active",
      createdAt: "2023-09-15",
      lastUpdated: "2023-12-08",
    },
    {
      id: 5,
      name: "LED Desk Lamp",
      description: "Adjustable LED desk lamp with touch controls and USB charging port",
      sku: "LDL-005",
      price: 89.99,
      quantity: 12,
      minStock: 20,
      category: "Lighting",
      supplier: { id: 4, name: "LightWorks Co" },
      warehouse: { id: 4, name: "Southeast Facility" },
      status: "Critical",
      createdAt: "2023-08-10",
      lastUpdated: "2023-11-28",
    },
    {
      id: 6,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking",
      sku: "WM-006",
      price: 29.99,
      quantity: 300,
      minStock: 100,
      category: "Accessories",
      supplier: { id: 1, name: "TechCorp Solutions" },
      warehouse: { id: 1, name: "Main Warehouse" },
      status: "Active",
      createdAt: "2023-10-05",
      lastUpdated: "2023-12-14",
    },
    {
      id: 7,
      name: "Standing Desk Converter",
      description: "Height-adjustable standing desk converter for existing desks",
      sku: "SDC-007",
      price: 299.99,
      quantity: 18,
      minStock: 15,
      category: "Furniture",
      supplier: { id: 2, name: "FurniMax Industries" },
      warehouse: { id: 2, name: "West Coast Hub" },
      status: "Active",
      createdAt: "2023-09-20",
      lastUpdated: "2023-12-01",
    },
    {
      id: 8,
      name: "USB-C Hub",
      description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots",
      sku: "UCH-008",
      price: 49.99,
      quantity: 0,
      minStock: 50,
      category: "Accessories",
      supplier: { id: 3, name: "AccessoryPlus Ltd" },
      warehouse: { id: 1, name: "Main Warehouse" },
      status: "Out of Stock",
      createdAt: "2023-11-10",
      lastUpdated: "2023-12-15",
    },
  ]

  const suppliers = [
    { id: 1, name: "TechCorp Solutions" },
    { id: 2, name: "FurniMax Industries" },
    { id: 3, name: "AccessoryPlus Ltd" },
    { id: 4, name: "LightWorks Co" },
    { id: 5, name: "Global Electronics" },
  ]

  const warehouses = [
    { id: 1, name: "Main Warehouse" },
    { id: 2, name: "West Coast Hub" },
    { id: 3, name: "Central Distribution" },
    { id: 4, name: "Southeast Facility" },
  ]

  const categories = ["Electronics", "Furniture", "Accessories", "Lighting"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSupplier = selectedSupplier === "all" || product.supplier.id.toString() === selectedSupplier
    const matchesWarehouse = selectedWarehouse === "all" || product.warehouse.id.toString() === selectedWarehouse
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    const matchesPriceRange = (() => {
      switch (priceRange) {
        case "under-50":
          return product.price < 50
        case "50-100":
          return product.price >= 50 && product.price <= 100
        case "100-200":
          return product.price > 100 && product.price <= 200
        case "over-200":
          return product.price > 200
        default:
          return true
      }
    })()

    return matchesSearch && matchesSupplier && matchesWarehouse && matchesCategory && matchesPriceRange
  })

  const handleDeleteProduct = (productId: number, productName: string, sku: string) => {
    // Simulate deletion with potential foreign key constraint
    const hasOrderItems = Math.random() > 0.7 // 30% chance of having order items

    if (hasOrderItems) {
      toast({
        title: "Cannot delete product",
        description: `Cannot delete '${productName}' (SKU: ${sku}). It is currently linked to existing order items.`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Product deleted",
        description: `'${productName}' (SKU: ${sku}) has been successfully deleted.`,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Low Stock":
        return "bg-yellow-500"
      case "Critical":
        return "bg-orange-500"
      case "Out of Stock":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return "Out of Stock"
    if (quantity <= minStock * 0.5) return "Critical"
    if (quantity <= minStock) return "Low Stock"
    return "Active"
  }

  // Calculate summary statistics
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.quantity <= p.minStock && p.quantity > 0).length
  const outOfStockProducts = products.filter((p) => p.quantity === 0).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Product Catalog</h1>
        <div className="flex space-x-2">
          <Link href="/products/new">
            <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
          <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
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
                <p className="text-sm font-medium text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-white">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-white">{lowStockProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Out of Stock</p>
                <p className="text-2xl font-bold text-white">{outOfStockProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-white">${(totalValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products by name, SKU, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#2C3444] border-none text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-[180px] bg-[#2C3444] border-none text-white">
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3444] border-[#3C4454]">
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-[180px] bg-[#2C3444] border-none text-white">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3444] border-[#3C4454]">
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px] bg-[#2C3444] border-none text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3444] border-[#3C4454]">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[150px] bg-[#2C3444] border-none text-white">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3444] border-[#3C4454]">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-50">Under $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="over-200">Over $200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2C3444]">
                <TableHead className="text-gray-300">Product</TableHead>
                <TableHead className="text-gray-300">SKU</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Quantity</TableHead>
                <TableHead className="text-gray-300">Supplier</TableHead>
                <TableHead className="text-gray-300">Warehouse</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity, product.minStock)
                return (
                  <TableRow key={product.id} className="border-[#2C3444]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 font-mono">{product.sku}</TableCell>
                    <TableCell className="text-gray-300">${product.price}</TableCell>
                    <TableCell>
                      <div className="text-gray-300">
                        {product.quantity}
                        {product.quantity <= product.minStock && product.quantity > 0 && (
                          <span className="text-yellow-500 text-xs ml-1">(Min: {product.minStock})</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-300">
                        <Building2 className="h-3 w-3 mr-1" />
                        {product.supplier.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-300">
                        <Warehouse className="h-3 w-3 mr-1" />
                        {product.warehouse.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(status)} text-white`}>{status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="text-[#B6F400] hover:bg-[#2C3444]">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-[#2C3444]">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:bg-[#2C3444]">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#1C2333] border-[#2C3444]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Product</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to delete '{product.name}' (SKU: {product.sku})? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#2C3444] text-white border-[#2C3444] hover:bg-[#3C4454]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id, product.name, product.sku)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
