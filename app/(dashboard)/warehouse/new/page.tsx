// app/warehouses/new/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useWarehouse } from "@/providers/wareHouseProvider"
import { CreateWarehouseData } from "@/types/index"

export default function WarehouseForm() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    createWarehouse,
    loading: contextLoading,
    error: contextError,
    selectWarehouse
  } = useWarehouse()

  // Initial state for a new warehouse
  const [formData, setFormData] = useState<CreateWarehouseData>({
    name: "",
    location: "",
    capacity: 0,
    currentOccupancy: 0,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CreateWarehouseData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Warehouse name is required"
    }
    if (!formData.location?.trim()) {
      newErrors.location = "Location is required"
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0"
    }
    if (formData.currentOccupancy < 0) {
      newErrors.currentOccupancy = "Occupancy cannot be negative"
    }
    if (formData.currentOccupancy > formData.capacity) {
      newErrors.currentOccupancy = "Occupancy cannot exceed capacity"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    let success = false
    try {
      success = await createWarehouse(formData)
      if (success) {
        toast({
          title: `Warehouse created!`,
          description: `${formData.name} has been successfully added.`,
        })
        router.push("/warehouses")
      } else {
        toast({
          title: `Error creating warehouse`,
          description: contextError || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = "Add New Warehouse"
  const buttonText = isSubmitting ? "Creating..." : "Create Warehouse"

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/warehouses">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Warehouses
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-[#1C2333] border-none">
          <CardHeader>
            <CardTitle className="text-[#B6F400]">Warehouse Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Warehouse Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-[#2C3444] border-none text-white"
                  placeholder="Enter warehouse name"
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-[#2C3444] border-none text-white"
                  placeholder="Enter warehouse location"
                />
                {formErrors.location && <p className="text-red-500 text-sm">{formErrors.location}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-gray-300">
                    Capacity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", Number(e.target.value))}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter capacity"
                  />
                  {formErrors.capacity && <p className="text-red-500 text-sm">{formErrors.capacity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentOccupancy" className="text-gray-300">
                    Current Occupancy
                  </Label>
                  <Input
                    id="currentOccupancy"
                    type="number"
                    value={formData.currentOccupancy}
                    onChange={(e) => handleInputChange("currentOccupancy", Number(e.target.value))}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter current occupancy"
                  />
                  {formErrors.currentOccupancy && <p className="text-red-500 text-sm">{formErrors.currentOccupancy}</p>}
                </div>
              </div>

             

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || contextLoading}
                  className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {buttonText}
                </Button>
                <Link href="/warehouses">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent"
                    onClick={() => selectWarehouse(null)}
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
