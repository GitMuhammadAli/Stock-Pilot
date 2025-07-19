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
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Package,
  ShoppingCart,
  TrendingUp,
  Star,
  Building2,
} from "lucide-react"

// This would normally come from the API using the ID from params
export default function SupplierDetailsPage({ params }: { params: { id: string } }) {
  const supplierId = Number.parseInt(params.id)

  // Mock data - in real app, this would be fetched based on supplierId
  const supplier = {
    id: supplierId,
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94025",
    website: "https://techcorp.com",
    contactPerson: "John Smith",
    status: "Active",
    rating: 4.8,
    createdAt: "2023-01-15",
    notes: "Reliable supplier for electronic components. Fast delivery and excellent customer service.",
    totalOrders: 128,
    totalValue: 245000,
    lastOrderDate: "2023-12-14",
  }

  const supplierProducts = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      sku: "WHP-001",
      category: "Electronics",
      price: 99.99,
      stock: 150,
      status: "Active",
    },
    {
      id: 2,
      name: "Bluetooth Speaker Mini",
      sku: "BSM-002",
      category: "Electronics",
      price: 49.99,
      stock: 200,
      status: "Active",
    },
    {
      id: 3,
      name: "USB-C Cable 2m",
      sku: "USC-003",
      category: "Accessories",
      price: 19.99,
      stock: 500,
      status: "Active",
    },
    {
      id: 4,
      name: "Wireless Charger Pad",
      sku: "WCP-004",
      category: "Accessories",
      price: 29.99,
      stock: 75,
      status: "Low Stock",
    },
  ]

  const supplierOrders = [
    {
      id: 1001,
      orderNumber: "PO-2023-1001",
      date: "2023-12-14",
      status: "Delivered",
      items: 25,
      total: 2499.75,
    },
    {
      id: 1002,
      orderNumber: "PO-2023-1002",
      date: "2023-12-10",
      status: "In Transit",
      items: 15,
      total: 1299.85,
    },
    {
      id: 1003,
      orderNumber: "PO-2023-1003",
      date: "2023-12-05",
      status: "Delivered",
      items: 30,
      total: 3199.7,
    },
    {
      id: 1004,
      orderNumber: "PO-2023-1004",
      date: "2023-11-28",
      status: "Delivered",
      items: 20,
      total: 1899.8,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Delivered":
        return "bg-green-500"
      case "In Transit":
        return "bg-blue-500"
      case "Low Stock":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-400"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/suppliers">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-white">{supplier.name}</h1>
          <Badge className={`${getStatusColor(supplier.status)} text-white`}>{supplier.status}</Badge>
        </div>
        <Link href={`/suppliers/${supplier.id}/edit`}>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Edit className="mr-2 h-4 w-4" />
            Edit Supplier
          </Button>
        </Link>
      </div>

      {/* Supplier Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Globe className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <a href={supplier.website} className="text-blue-400 hover:underline">
                      {supplier.website}
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-[#B6F400] mt-1" />
                    <span>{supplier.address}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>Member since {new Date(supplier.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {supplier.notes && (
                <div className="pt-4 border-t border-[#2C3444]">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Notes</h4>
                  <p className="text-gray-300">{supplier.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Rating Card */}
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{supplier.rating}</div>
                <div className="flex justify-center space-x-1 mb-2">{getRatingStars(supplier.rating)}</div>
                <p className="text-sm text-gray-400">Supplier Rating</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-[#1C2333] border-none">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ShoppingCart className="h-6 w-6 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-xl font-bold text-white">{supplier.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C2333] border-none">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-400">Total Value</p>
                    <p className="text-xl font-bold text-white">${supplier.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C2333] border-none">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-400">Products</p>
                    <p className="text-xl font-bold text-white">{supplierProducts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Products and Orders Tabs */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="p-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-[#2C3444] border-none">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Products ({supplierProducts.length})
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Orders ({supplierOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2C3444]">
                    <TableHead className="text-gray-300">Product</TableHead>
                    <TableHead className="text-gray-300">SKU</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">Stock</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierProducts.map((product) => (
                    <TableRow key={product.id} className="border-[#2C3444]">
                      <TableCell className="font-medium text-white">{product.name}</TableCell>
                      <TableCell className="text-gray-300">{product.sku}</TableCell>
                      <TableCell className="text-gray-300">{product.category}</TableCell>
                      <TableCell className="text-gray-300">${product.price}</TableCell>
                      <TableCell className="text-gray-300">{product.stock}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(product.status)} text-white`}>{product.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2C3444]">
                    <TableHead className="text-gray-300">Order Number</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Items</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierOrders.map((order) => (
                    <TableRow key={order.id} className="border-[#2C3444]">
                      <TableCell className="font-medium text-white">{order.orderNumber}</TableCell>
                      <TableCell className="text-gray-300">{order.date}</TableCell>
                      <TableCell className="text-gray-300">{order.items}</TableCell>
                      <TableCell className="text-gray-300">${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
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
