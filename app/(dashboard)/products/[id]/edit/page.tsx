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
  const productId = Number(params.id)

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

  // ✅ Load product + reference data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Simulate parallel API calls
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock suppliers & warehouses
        setSuppliers([
          { id: 1, name: "TechCorp Solutions" },
          { id: 2, name: "FurniMax Industries" },
          { id: 3, name: "AccessoryPlus Ltd" },
        ])
        setWarehouses([
          { id: 1, name: "Main Warehouse" },
          { id: 2, name: "West Coast Hub" },
          { id: 3, name: "Central Distribution" },
        ])

        // Mock existing product data
        setFormData({
          name: "Wireless Headphones Pro",
          description: "Premium noise-canceling headphones with 30h battery.",
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
          title: "Error",
          description: "Failed to load product data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [productId, toast])

  // ✅ Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // ✅ Validate before submit
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.sku.trim()) newErrors.sku = "SKU is required"
    if (!formData.price || Number(formData.price) < 0) newErrors.price = "Price must be valid"
    if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = "Quantity must be valid"
    if (!formData.minStock || Number(formData.minStock) < 0) newErrors.minStock = "Minimum stock must be valid"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required"
    if (!formData.warehouseId) newErrors.warehouseId = "Warehouse is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      toast({
        title: "Product updated",
        description: `${formData.name} has been successfully updated.`,
      })

      router.push(`/products/${productId}`)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update product.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#B6F400]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/products/${productId}`}>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">Edit Product</h1>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <Card className="bg-[#1C2333] border-none">
          <CardHeader>
            <CardTitle className="text-[#B6F400]">Product Info</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-[#2C3444] text-white"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="sku" className="text-gray-300">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
                    className="bg-[#2C3444] text-white font-mono"
                  />
                  {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-[#2C3444] text-white min-h-[100px]"
                />
              </div>

              {/* Price, Qty, Min Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["price", "quantity", "minStock"].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="text-gray-300">
                      {field === "price" ? "Price ($)" : field === "quantity" ? "Quantity" : "Min Stock"} *
                    </Label>
                    <Input
                      id={field}
                      type="number"
                      min="0"
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="bg-[#2C3444] text-white"
                    />
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}
              </div>

              {/* Category, Supplier, Warehouse */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-gray-300">Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                    <SelectTrigger className="bg-[#2C3444] text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C3444]">
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>

                <div>
                  <Label className="text-gray-300">Supplier *</Label>
                  <Select value={formData.supplierId} onValueChange={(val) => handleInputChange("supplierId", val)}>
                    <SelectTrigger className="bg-[#2C3444] text-white">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C3444]">
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplierId && <p className="text-red-500 text-sm">{errors.supplierId}</p>}
                </div>

                <div>
                  <Label className="text-gray-300">Warehouse *</Label>
                  <Select value={formData.warehouseId} onValueChange={(val) => handleInputChange("warehouseId", val)}>
                    <SelectTrigger className="bg-[#2C3444] text-white">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C3444]">
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.warehouseId && <p className="text-red-500 text-sm">{errors.warehouseId}</p>}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="bg-[#B6F400] text-black">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </>
                  )}
                </Button>
                <Link href={`/products/${productId}`}>
                  <Button variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444]">
                    <X className="h-4 w-4 mr-2" /> Cancel
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
