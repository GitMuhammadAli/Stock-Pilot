"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWarehouse } from "@/providers/wareHouseProvider";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { Edit, Eye, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function WarehousesPage() {
  const { toast } = useToast();
  const {
    warehouses,
    loading,
    error,
    getAllWarehousesForUser,
    deleteWarehouse,
    selectWarehouse,
  } = useWarehouse();

  useEffect(() => {
    getAllWarehousesForUser();
  }, []);

  // Skeleton loader for table rows
  const SkeletonRow = () => (
    <TableRow className="border-[#2C3444] animate-pulse">
      <TableCell>
        <div className="h-5 w-24 bg-slate-600 rounded-lg"></div>
      </TableCell>
      <TableCell>
        <div className="h-5 w-32 bg-slate-600 rounded-lg"></div>
      </TableCell>
      <TableCell>
        <div className="h-5 w-16 bg-slate-600 rounded-lg"></div>
      </TableCell>
      <TableCell>
        <div className="h-5 w-16 bg-slate-600 rounded-lg"></div>
      </TableCell>
      <TableCell>
        <div className="h-5 w-20 bg-slate-600 rounded-lg"></div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Warehouse Management
        </h1>
        <Link href="/warehouse/new">
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Plus className="mr-2 h-4 w-4" />
            Add New Warehouse
          </Button>
        </Link>
      </div>

      {/* Warehouses Table */}
      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">
            Warehouses ({warehouses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#2C3444]">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Capacity</TableHead>
                  <TableHead className="text-gray-300">Occupancy</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Show 5 skeleton rows while loading */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </TableBody>
            </Table>
          ) : error ? (
            <p className="text-red-500">Error loading warehouses: {error}</p>
          ) : warehouses.length === 0 ? (
            <p className="text-gray-400">No warehouses found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#2C3444]">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Capacity</TableHead>
                  <TableHead className="text-gray-300">Occupancy</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id} className="border-[#2C3444]">
                    <TableCell className="text-white font-medium">
                      {warehouse.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {warehouse.location || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {warehouse.capacity}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {warehouse.currentOccupancy ?? "0"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* View */}
                        <Link href={`/warehouse/${warehouse.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#B6F400] hover:bg-[#2C3444]"
                            onClick={() => selectWarehouse(warehouse)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Edit */}
                        <Link href={`/warehouse/${warehouse.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:bg-[#2C3444]"
                            onClick={() => selectWarehouse(warehouse)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-[#2C3444]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#1C2333] border-[#2C3444]">
                            <AlertDialogTitle className="text-white">
                              Delete Warehouse
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete '{warehouse.name}
                              '? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="flex justify-end space-x-2 mt-4">
                              <AlertDialogCancel className="bg-[#2C3444] text-white hover:bg-[#3C4454]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  const success = await deleteWarehouse(
                                    warehouse.id
                                  );
                                  if (success) {
                                    toast({
                                      title: "Warehouse deleted",
                                      variant: "default",
                                    });
                                  } else {
                                    toast({
                                      title: "Error deleting warehouse",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
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
  );
}
