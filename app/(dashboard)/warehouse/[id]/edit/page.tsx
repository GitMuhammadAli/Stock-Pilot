// app/warehouse/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, X, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWarehouse } from "@/providers/wareHouseProvider"
import { CreateWarehouseData } from "@/types"

export default function EditWarehouseForm() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getWarehouse, updateWarehouse, loading, error } = useWarehouse()

  const [formData, setFormData] = useState<CreateWarehouseData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

 useEffect(() => {
  if (id) {
    getWarehouse(id as string).then((data) => {
      if (data) {
        const normalized: CreateWarehouseData = {
          name: data.name,
          location: data.location,
          capacity: data.capacity,
          currentOccupancy: data.currentOccupancy ?? 0,
          supplier: data.supplier ?? "",
          manager: data.manager ?? "",
          description: data.description ?? "",
        }
        setFormData(normalized)
      }
    })
  }
}, [id, getWarehouse])

  if (!getWarehouse) {
    return (
      <div className="p-6">
        {/* Skeleton loader */}
        <div className="relative flex w-full max-w-lg animate-pulse gap-4 p-4 bg-[#1C2333] rounded-xl">
          <div className="h-14 w-14 rounded-full bg-slate-600"></div>
          <div className="flex-1">
            <div className="mb-2 h-5 w-3/5 rounded-lg bg-slate-600"></div>
            <div className="h-5 w-[90%] rounded-lg bg-slate-600"></div>
          </div>
          <div className="absolute bottom-5 right-5 h-4 w-4 rounded-full bg-slate-600"></div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof CreateWarehouseData, value: string | number) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSubmitting(true)
    try {
      const success = await updateWarehouse(id as string, formData)
      if (success) {
        toast({
          title: "Warehouse updated",
          description: `${formData.name} has been updated successfully.`,
        })
        router.push(`/warehouse/${id}`)
      } else {
        toast({
          title: "Error",
          description: error || "Update failed.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formData) {
    return <p className="text-gray-400">Loading warehouse...</p>
  }

  const buttonText = isSubmitting ? "Updating..." : "Update Warehouse"

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center space-x-4">
        <Link href={`/warehouse/${id}`}>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Warehouse
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">Edit {formData.name}</h1>
      </div>

      <Card className="bg-[#1C2333] border-none w-full">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">Update Warehouse Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Warehouse Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Warehouse Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-[#2C3444] border-none text-white"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-[#2C3444] border-none text-white"
              />
            </div>

            {/* Capacity & Occupancy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-gray-300">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", Number(e.target.value))}
                  className="bg-[#2C3444] border-none text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentOccupancy" className="text-gray-300">Current Occupancy</Label>
                <Input
                  id="currentOccupancy"
                  type="number"
                  value={formData.currentOccupancy || 0}
                  onChange={(e) => handleInputChange("currentOccupancy", Number(e.target.value))}
                  className="bg-[#2C3444] border-none text-white"
                />
              </div>
            </div>

            {/* Supplier */}
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-gray-300">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier || ""}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                className="bg-[#2C3444] border-none text-white"
              />
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-gray-300">Manager</Label>
              <Input
                id="manager"
                value={formData.manager || ""}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                className="bg-[#2C3444] border-none text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-[#2C3444] border-none text-white"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
              >
                <Save className="mr-2 h-4 w-4" />
                {buttonText}
              </Button>
              <Link href={`/warehouse/${id}`}>
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
  )
}
