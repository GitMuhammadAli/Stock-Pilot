"use client"

import { useState, useMemo, useEffect } from "react"
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
import { useProduct } from "@/providers/productProvider"

export default function ProductsPage() {
  const { toast } = useToast()
  const { products, getAllProducts, loading, error, deleteProduct } = useProduct()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("all")
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  // 🚀 Fetch products on mount
  useEffect(() => {
    getAllProducts()
  }, [getAllProducts])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSupplier =
        selectedSupplier === "all" || product.supplier?.name === selectedSupplier
      const matchesWarehouse =
        selectedWarehouse === "all" || product.warehouse?.name === selectedWarehouse
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory

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

      return (
        matchesSearch &&
        matchesSupplier &&
        matchesWarehouse &&
        matchesCategory &&
        matchesPriceRange
      )
    })
  }, [products, searchTerm, selectedSupplier, selectedWarehouse, selectedCategory, priceRange])

  // 🗑️ Handle delete
  const handleDeleteProduct = async (productId: string, productName: string, sku: string) => {
    const success = await deleteProduct(productId)
    if (success) {
      toast({
        title: "Product deleted",
        description: `'${productName}' (SKU: ${sku}) was successfully deleted.`,
      })
    } else {
      toast({
        title: "Delete failed",
        description: `Could not delete '${productName}' (SKU: ${sku}).`,
        variant: "destructive",
      })
    }
  }

  // 🟢 Status helpers
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

  // 📊 Stats
  const totalProducts = products.length
  const lowStockProducts = products.filter(
    (p) => p.quantity <= p.minStock && p.quantity > 0
  ).length
  const outOfStockProducts = products.filter((p) => p.quantity === 0).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Product Catalog</h1>
        <div className="flex space-x-2">
          <Link href="/products/new">
            <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6 flex items-center">
            <Package className="h-8 w-8 text-[#B6F400]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6 flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-white">{lowStockProducts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6 flex items-center">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-white">{outOfStockProducts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6 flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${(totalValue / 1000).toFixed(0)}K
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
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
              {Array.from(new Set(products.map((p) => p.supplier?.name))).map(
                (s) => s && <SelectItem key={s} value={s}>{s}</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-[180px] bg-[#2C3444] border-none text-white">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3444] border-[#3C4454]">
              <SelectItem value="all">All Warehouses</SelectItem>
              {Array.from(new Set(products.map((p) => p.warehouse?.name))).map(
                (w) => w && <SelectItem key={w} value={w}>{w}</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px] bg-[#2C3444] border-none text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#2C3444] border-[#3C4454]">
              <SelectItem value="all">All Categories</SelectItem>
              {Array.from(new Set(products.map((p) => p.category))).map(
                (c) => c && <SelectItem key={c} value={c}>{c}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products table */}
      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading && <p className="text-gray-400 p-4">Loading...</p>}
          {error && <p className="text-red-400 p-4">{error}</p>}
          {!loading && !error && (
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
                          <div className="font-medium text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {product.category}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {product.sku}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        ${product.price}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="text-gray-300 flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {product.supplier?.name}
                      </TableCell>
                      <TableCell className="text-gray-300 flex items-center">
                        <Warehouse className="h-3 w-3 mr-1" />
                        {product.warehouse?.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(status)} text-white`}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/products/${product.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#B6F400] hover:bg-[#2C3444]"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/products/${product.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:bg-[#2C3444]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-[#2C3444]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#1C2333] border-[#2C3444]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  Are you sure you want to delete "
                                  {product.name}" (SKU: {product.sku})?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-[#2C3444] text-white hover:bg-[#3C4454]">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product.id,
                                      product.name,
                                      product.sku
                                    )
                                  }
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
