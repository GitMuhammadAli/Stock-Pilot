"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const productId = Number.parseInt(params.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    quantity: "",
    minStock: "",
    category: "",
    supplierId: "",
    warehouseId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [suppliers, setSuppliers] = useState<Array<{ id: number; name: string }>>([])
  const [warehouses, setWarehouses] = useState<Array<{ id: number; name: string }>>([])

  const categories = ["Electronics", "Furniture", "Accessories", "Lighting", "Office Supplies", "Tools"]

  // Simulate loading product data and prerequisites
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Simulate parallel API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock suppliers and warehouses
        setSuppliers([
          { id: 1, name: "TechCorp Solutions" },
          { id: 2, name: "FurniMax Industries" },
          { id: 3, name: "AccessoryPlus Ltd" },
          { id: 4, name: "LightWorks Co" },
          { id: 5, name: "Global Electronics" },
        ])

        setWarehouses([
          { id: 1, name: "Main Warehouse" },
          { id: 2, name: "West Coast Hub" },
          { id: 3, name: "Central Distribution" },
          { id: 4, name: "Southeast Facility" },
        ])

        // Mock product data - in real app, this would be fetched based on productId
        setFormData({
          name: "Wireless Headphones Pro",
          description:
            "Premium noise-canceling wireless headphones with 30-hour battery life and superior sound quality. Features advanced Bluetooth 5.0 connectivity and comfortable over-ear design.",
          sku: "WHP-001",
          price: "199.99",
          quantity: "150",
          minStock: "50",
          category: "Electronics",
          supplierId: "1",
          warehouseId: "1",
        })
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to load product information. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [productId, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required"
    }

    if (!formData.price || Number.parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a non-negative number"
    }

    if (!formData.quantity || Number.parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Quantity must be a non-negative number"
    }

    if (!formData.minStock || Number.parseInt(formData.minStock) < 0) {
      newErrors.minStock = "Minimum stock must be a non-negative number"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.supplierId) {
      newErrors.supplierId = "Supplier is required"
    }

    if (!formData.warehouseId) {
      newErrors.warehouseId = "Warehouse is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Product updated!",
        description: `${formData.name} has been successfully updated.`,
      })

      router.push(`/products/${productId}`)
    } catch (error) {
      toast({
        title: "Error updating product",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href={`/products/${productId}`}>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-white">Edit Product</h1>
        </div>

        <div className="max-w-4xl">
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#B6F400] mx-auto mb-4" />
                  <p className="text-gray-300">Loading product information...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/products/${productId}`}>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">Edit Product</h1>
      </div>

      <div className="max-w-4xl">
        <Card className="bg-[#1C2333] border-none">
          <CardHeader>
            <CardTitle className="text-[#B6F400]">Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-gray-300">
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
                    className="bg-[#2C3444] border-none text-white font-mono"
                    placeholder="Enter SKU (e.g., ABC-001)"
                  />
                  {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-[#2C3444] border-none text-white min-h-[100px]"
                  placeholder="Enter product description"
                />
              </div>

              {/* Pricing and Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-300">
                    Current Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="0"
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock" className="text-gray-300">
                    Minimum Stock <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange("minStock", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="0"
                  />
                  {errors.minStock && <p className="text-red-500 text-sm">{errors.minStock}</p>}
                </div>
              </div>

              {/* Category and Associations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="bg-[#2C3444] border-none text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C3444] border-[#3C4454]">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-gray-300">
                    Supplier <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.supplierId} onValueChange={(value) => handleInputChange("supplierId", value)}>
                    <SelectTrigger className="bg-[#2C3444] border-none text-white">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C3444] border-[#3C4454]">
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplierId && <p className="text-red-500 text-sm">{errors.supplierId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouse" className="text-gray-300">
                    Warehouse <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.warehouseId}
                    onValueChange={(value) => handleInputChange("warehouseId", value)}
                  >
                    <SelectTrigger className="bg-[#2C3444] border-none text-white">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C3444] border-[#3C4454]">
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.warehouseId && <p className="text-red-500 text-sm">{errors.warehouseId}</p>}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Link href={`/products/${productId}`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
