"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useWarehouse  } from "@/providers/wareHouseProvider"
import { useEffect } from "react"

export default function WarehousesPage() {
  const {warehouses, loading, error, getAllWarehousesForUser } = useWarehouse();
  

  useEffect(() => {
    getAllWarehousesForUser();
  }, []);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Warehouse Management</h1>
        <Button>Add Warehouse</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity %</TableHead>
                <TableHead>current Occupancy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.length > 0 ? (
                warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell>{warehouse.name}</TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>{warehouse.capacity}</TableCell>
                    <TableCell>{warehouse.currentOccupancy}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {loading ? "Loading..." : "No warehouses found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}