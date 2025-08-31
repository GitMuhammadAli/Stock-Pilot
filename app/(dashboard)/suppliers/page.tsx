// app/suppliers/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Users,
  Package,
  TrendingUp,
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
import { useSupplier } from "@/providers/supplierProvider" // Import the useSupplier hook
import { Supplier } from "../../types/index" // Import the Supplier type

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const {
    suppliers,
    loading,
    error,
    getAllSuppliers,
    deleteSupplier,
    selectSupplier, // To set the selected supplier when navigating
  } = useSupplier()

  // Fetch suppliers on component mount
  useEffect(() => {
    getAllSuppliers()
  }, [getAllSuppliers])

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteSupplier = async (supplierId: string, supplierName: string) => {
    const success = await deleteSupplier(supplierId)
    if (success) {
      toast({
        title: "Supplier deleted",
        description: `'${supplierName}' has been successfully deleted.`,
      })
    } else {
      toast({
        title: "Error deleting supplier",
        description: error || `Failed to delete '${supplierName}'. It might be linked to products or orders or an unexpected error occurred.`,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-500" : "bg-gray-500"
  }

  const getRatingColor = (rating: number | undefined) => {
    if (rating === undefined) return "text-gray-400"; // No rating
    if (rating >= 4.5) return "text-green-500"
    if (rating >= 4.0) return "text-yellow-500"
    return "text-red-500"
  }

  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length
  const totalProducts = suppliers.reduce((sum, s) => sum + (s.productsCount || 0), 0) // Use 0 if undefined
  const totalValue = suppliers.reduce((sum, s) => sum + (s.totalValue || 0), 0) // Use 0 if undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Supplier Management</h1>
        <Link href="/suppliers/new">
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Plus className="mr-2 h-4 w-4" />
            Add New Supplier
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[#B6F400]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Suppliers</p>
                <p className="text-2xl font-bold text-white">{totalSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Suppliers</p>
                <p className="text-2xl font-bold text-white">{activeSuppliers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C2333] border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
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
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-white">${(totalValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#2C3444] border-none text-white"
          />
        </div>
        <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent">
          Filter
        </Button>
        <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent">
          Export
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">Suppliers ({filteredSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400">Loading suppliers...</p>
          ) : error ? (
            <p className="text-red-500">Error loading suppliers: {error}</p>
          ) : filteredSuppliers.length === 0 ? (
            <p className="text-gray-400">No suppliers found matching your criteria.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#2C3444]">
                  <TableHead className="text-gray-300">Supplier</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Products</TableHead>
                  <TableHead className="text-gray-300">Orders</TableHead>
                  <TableHead className="text-gray-300">Total Value</TableHead>
                  <TableHead className="text-gray-300">Rating</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="border-[#2C3444]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{supplier.name}</div>
                        <div className="text-sm text-gray-400 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {supplier.address?.split(",")[1]?.trim() || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-300 flex items-center">
                          <Mail className="h-3 w-3 mr-2" />
                          {supplier.email || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-300 flex items-center">
                          <Phone className="h-3 w-3 mr-2" />
                          {supplier.phone || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{supplier.productsCount}</TableCell>
                    <TableCell className="text-gray-300">{supplier.ordersCount}</TableCell>
                    <TableCell className="text-gray-300">${supplier.totalValue}</TableCell>
                    <TableCell className={`font-medium ${getRatingColor(supplier.rating)}`}>
                      {supplier.rating !== undefined ? `⭐ ${supplier.rating}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(supplier.status)} text-white`}>{supplier.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/suppliers/${supplier.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#B6F400] hover:bg-[#2C3444]"
                            onClick={() => selectSupplier(supplier)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/suppliers/${supplier.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:bg-[#2C3444]"
                            onClick={() => selectSupplier(supplier)}
                          >
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
                              <AlertDialogTitle className="text-white">Delete Supplier</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to delete '{supplier.name}'? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#2C3444] text-white border-[#2C3444] hover:bg-[#3C4454]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSupplier(supplier.id, supplier.name)}
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}