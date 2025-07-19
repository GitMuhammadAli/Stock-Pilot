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
import { ArrowLeft, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const supplierId = Number.parseInt(params.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    website: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Simulate loading supplier data
  useEffect(() => {
    const loadSupplierData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data - in real app, this would be fetched based on supplierId
      setFormData({
        name: "TechCorp Solutions",
        email: "contact@techcorp.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Street, Silicon Valley, CA 94025",
        contactPerson: "John Smith",
        website: "https://techcorp.com",
        notes: "Reliable supplier for electronic components. Fast delivery and excellent customer service.",
      })
      setIsLoading(false)
    }

    loadSupplierData()
  }, [supplierId])

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
      newErrors.name = "Supplier name is required"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-$$$$]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
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
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Supplier updated!",
        description: `${formData.name} has been successfully updated.`,
      })

      router.push(`/suppliers/${supplierId}`)
    } catch (error) {
      toast({
        title: "Error updating supplier",
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
          <Link href="/suppliers">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-white">Edit Supplier</h1>
        </div>
        <div className="max-w-2xl">
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-[#2C3444] rounded w-1/4"></div>
                <div className="h-10 bg-[#2C3444] rounded"></div>
                <div className="h-4 bg-[#2C3444] rounded w-1/4"></div>
                <div className="h-10 bg-[#2C3444] rounded"></div>
                <div className="h-4 bg-[#2C3444] rounded w-1/4"></div>
                <div className="h-20 bg-[#2C3444] rounded"></div>
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
        <Link href={`/suppliers/${supplierId}`}>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Supplier
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">Edit Supplier</h1>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-[#1C2333] border-none">
          <CardHeader>
            <CardTitle className="text-[#B6F400]">Supplier Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Supplier Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter supplier name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-gray-300">
                    Contact Person
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-300">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="bg-[#2C3444] border-none text-white"
                  placeholder="Enter website URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-[#2C3444] border-none text-white min-h-[100px]"
                  placeholder="Enter full address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-300">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="bg-[#2C3444] border-none text-white min-h-[80px]"
                  placeholder="Additional notes about the supplier"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Link href={`/suppliers/${supplierId}`}>
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
