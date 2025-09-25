// app/suppliers/new/page.tsx
"use client"

import type React from "react"
import { useState } from "react" // Removed useEffect as no initial data fetching for new
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSupplier } from "@/providers/supplierProvider" // Import useSupplier
import { CreateSupplierData } from "@/types/index" // Only import CreateSupplierData

// No SupplierFormProps needed as it's purely for new creation
export default function SupplierForm() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    createSupplier,
    loading: contextLoading, // Loading state from the context for data fetching/mutations
    error: contextError, // Error state from the context
    selectSupplier // To clear selected supplier when leaving (good practice, even if not strictly necessary here)
  } = useSupplier()

  // Initial state for a new supplier
  const [formData, setFormData] = useState<CreateSupplierData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    website: "",
    notes: "",
    // Status is often 'Active' by default for new creations and not sent in CreateSupplierData
    // If your backend expects a default status, it should apply it.
    // If you explicitly want to send it, ensure CreateSupplierData includes 'status'.
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CreateSupplierData, value: string) => { // Type field for CreateSupplierData keys
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // No handleStatusChange needed as new suppliers typically default to 'Active'
  // and the form won't offer a status selection for creation.

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Supplier name is required"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^[\d\s\-\(\)\+]{7,20}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (7-20 digits, +, -, spaces allowed)"
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
      });
      return
    }

    setIsSubmitting(true)
    let success = false
    try {
      // Create new supplier
      success = await createSupplier(formData) // formData is already CreateSupplierData
      
      if (success) {
        toast({
          title: `Supplier created!`,
          description: `${formData.name} has been successfully added.`,
        })
        router.push("/suppliers") // Redirect to suppliers list
      } else {
        // Error message already set by context if it failed for API reason
        toast({
          title: `Error creating supplier`,
          description: contextError || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Title and button text are fixed for creation
  const title = "Add New Supplier";
  const buttonText = isSubmitting ? "Creating..." : "Create Supplier";

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/suppliers">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Suppliers
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
      </div>

      <div className="w-full">
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
                  {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-gray-300">
                    Contact Person
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson || ""}
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
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter email address"
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-[#2C3444] border-none text-white"
                    placeholder="Enter phone number"
                  />
                  {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-300">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website || ""}
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
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-[#2C3444] border-none text-white min-h-[100px]"
                  placeholder="Enter full address"
                />
              </div>

              {/* Status selection removed for new supplier creation, as it typically defaults on backend */}
              {/* If your backend requires explicit status for new, uncomment and add it to CreateSupplierData */}

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-300">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="bg-[#2C3444] border-none text-white min-h-[80px]"
                  placeholder="Additional notes about the supplier"
                />
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
                <Link href="/suppliers">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent"
                    onClick={() => selectSupplier(null)} // Still good to clear selected on navigation
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