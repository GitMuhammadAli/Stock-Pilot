"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  Box,
  Warehouse as WarehouseIcon,
  Users,
  Activity,
  User,
  ClipboardList,
} from "lucide-react"
import { useWarehouse } from "@/providers/wareHouseProvider"
import { Warehouse } from "@/types"

export default function WarehouseDetail() {
  const { id } = useParams()
  const { getWarehouse } = useWarehouse()
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null)

  useEffect(() => {
    if (id) {
      getWarehouse(id as string).then(setWarehouse)
    }
  }, [id, getWarehouse])

  if (!warehouse) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/warehouse">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:bg-[#2C3444]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Warehouses
            </Button>
          </Link>
          <h1 className="text-3xl font-semibold text-white">{warehouse.name}</h1>
          {warehouse.status && (
            <Badge className={`${getStatusColor(warehouse.status)} text-white`}>
              {warehouse.status}
            </Badge>
          )}
        </div>
        <Link href={`/warehouse/${id}/edit`}>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Edit className="mr-2 h-4 w-4" />
            Edit Warehouse
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Information */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <WarehouseIcon className="mr-2 h-5 w-5" />
                Warehouse Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{warehouse.location}</span>
                  </div>
                  {warehouse.contactPhone && (
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <span>{warehouse.contactPhone}</span>
                    </div>
                  )}
                  {warehouse.contactEmail && (
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-4 w-4 mr-3 text-[#B6F400]" />
                      <span>{warehouse.contactEmail}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Box className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>Capacity: {warehouse.capacity}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>
                      Current Occupancy: {warehouse.currentOccupancy ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supplier */}
              {warehouse.supplier && (
                <div className="flex items-center text-gray-300">
                  <ClipboardList className="h-4 w-4 mr-3 text-[#B6F400]" />
                  <span>Supplier: {warehouse.supplier}</span>
                </div>
              )}

              {/* Manager */}
              {warehouse.manager && (
                <div className="flex items-center text-gray-300">
                  <User className="h-4 w-4 mr-3 text-[#B6F400]" />
                  <span>Manager: {warehouse.manager}</span>
                </div>
              )}

              {/* Description */}
              {warehouse.description && (
                <div className="pt-4 border-t border-[#2C3444]">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-300">{warehouse.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Box className="h-6 w-6 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-400">Capacity</p>
                  <p className="text-xl font-bold text-white">
                    {warehouse.capacity}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-400">Occupancy</p>
                  <p className="text-xl font-bold text-white">
                    {warehouse.currentOccupancy ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
