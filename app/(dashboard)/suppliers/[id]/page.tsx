"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Package,
  Star,
  Building2,
  User,
} from "lucide-react"
import { useSupplier } from "@/providers/supplierProvider"
import { Supplier } from "@/types"

// --- UI helpers ---
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-500"
    case "inactive":
      return "bg-gray-500"
    default:
      return "bg-blue-500"
  }
}

const getRatingStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-400"
      }`}
    />
  ))

// --- Skeleton loader ---
const SupplierSkeleton = () => (
  <div className="relative flex w-full animate-pulse gap-2 p-4">
    <div className="h-12 w-12 rounded-full bg-slate-400"></div>
    <div className="flex-1">
      <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400"></div>
      <div className="h-5 w-[90%] rounded-lg bg-slate-400"></div>
    </div>
    <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
  </div>
)

export default function SupplierDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { getSupplier, loading, error } = useSupplier()
  const [supplier, setSupplier] = useState<Supplier | null>(null)

  useEffect(() => {
    if (!id) return
    getSupplier(id).then(setSupplier)
  }, [id, getSupplier])

  if (loading && !supplier) {
    return (
      <div className="space-y-4">
        <SupplierSkeleton />
        <SupplierSkeleton />
        <SupplierSkeleton />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  if (!supplier) {
    return <p className="text-gray-400">No supplier found.</p>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/suppliers">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-white">{supplier.name}</h1>
          {supplier.status && (
            <Badge className={`${getStatusColor(supplier.status)} text-white`}>
              {supplier.status}
            </Badge>
          )}
        </div>
        <Link href={`/suppliers/${supplier.id}/edit`}>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Edit className="mr-2 h-4 w-4" />
            Edit Supplier
          </Button>
        </Link>
      </div>

      {/* Supplier Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info + Notes */}
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
                  {supplier.email && (
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.website && (
                    <div className="flex items-center text-gray-300">
                      <Globe className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <a
                        href={supplier.website}
                        className="text-blue-400 hover:underline"
                        target="_blank"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {supplier.address && (
                    <div className="flex items-start text-gray-300">
                      <MapPin className="h-4 w-4 mr-3 text-[#B6F400] mt-1" />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                  {supplier.contactPerson && (
                    <div className="flex items-center text-gray-300">
                      <User className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <span>{supplier.contactPerson}</span>
                    </div>
                  )}
                  {supplier.createdAt && (
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <span>
                        Member since {new Date(supplier.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
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

        {/* Rating + Quick Stats */}
        <div className="space-y-6">
          {supplier.rating && (
            <Card className="bg-[#1C2333] border-none">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{supplier.rating}</div>
                  <div className="flex justify-center space-x-1 mb-2">
                    {getRatingStars(Number(supplier.rating))}
                  </div>
                  <p className="text-sm text-gray-400">Supplier Rating</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#1C2333] border-none">
            <CardContent className="grid grid-cols-3 gap-4 text-center text-gray-300">
              <div>
                <ShoppingCart className="mx-auto mb-2 text-[#B6F400]" />
                <p className="font-semibold">{supplier.totalOrders ?? 0}</p>
                <p className="text-xs">Orders</p>
              </div>
              <div>
                <TrendingUp className="mx-auto mb-2 text-[#B6F400]" />
                <p className="font-semibold">${supplier.totalOrderValue ?? "0.00"}</p>
                <p className="text-xs">Order Value</p>
              </div>
              <div>
                <Package className="mx-auto mb-2 text-[#B6F400]" />
                <p className="font-semibold">{supplier.tier ?? "N/A"}</p>
                <p className="text-xs">Tier</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="p-6">
          <Tabs defaultValue="billing" className="w-full">
            <TabsList className="bg-[#2C3444] border-none">
              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="contract"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Contract
              </TabsTrigger>
            </TabsList>

            {/* Billing */}
            <TabsContent value="billing" className="mt-6 space-y-2 text-gray-300">
              {supplier.paymentTerms && (
                <p>Payment Terms: {supplier.paymentTerms} days</p>
              )}
              {supplier.currentBalance && (
                <p>Current Balance: ${supplier.currentBalance}</p>
              )}
              {supplier.creditLimit && <p>Credit Limit: ${supplier.creditLimit}</p>}
              {supplier.taxId && <p>Tax ID: {supplier.taxId}</p>}
            </TabsContent>

            {/* Contract */}
            <TabsContent value="contract" className="mt-6 text-gray-300">
              {supplier.contractStartDate ? (
                <p>
                  Valid from {supplier.contractStartDate} to{" "}
                  {supplier.contractEndDate || "Present"}
                </p>
              ) : (
                <p>No active contract</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
