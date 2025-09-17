"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWarehouse } from "@/providers/wareHouseProvider"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"


import { Edit, Eye, Trash2 } from "@deemlol/next-icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Badge } from "lucide-react"
export default function WarehousesPage() {
  const { toast } = useToast();
  const { 
    warehouses, 
    loading, 
    error, 
    getAllWarehousesForUser,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    selectedWarehouse,
    getWarehouse,
    selectWarehouse
  } = useWarehouse();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    capacity: 0,
    contactPhone: '',
    contactEmail: ''
  });

  useEffect(() => {
    getAllWarehousesForUser();
    console.log(warehouses)
  }, []);

  useEffect(() => {
    if (selectedWarehouse && isEditDialogOpen) {
      setFormData({
        name: selectedWarehouse.name,
        location: selectedWarehouse.location,
        description: selectedWarehouse.description || '',
        capacity: selectedWarehouse.capacity,
        contactPhone: selectedWarehouse.contactPhone || '',
        contactEmail: selectedWarehouse.contactEmail || ''
      });
    }
  }, [selectedWarehouse, isEditDialogOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createWarehouse(formData);
    if (success) {
      toast({
        title: "Warehouse created",
        variant: "default",
      });
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        location: '',
        description: '',
        capacity: 0,
        contactPhone: '',
        contactEmail: '',
        
      });
    } else {
      toast({
        title: "Error",
        variant: "destructive"
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouse) return;
    
    const success = await updateWarehouse(selectedWarehouse.id, formData);
    if (success) {
      toast({
        title: "Warehouse updated",
        variant: "default",
      });
      setIsEditDialogOpen(false);
    } else {
      toast({
        title: "Error",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedWarehouse) return;
    
    const success = await deleteWarehouse(selectedWarehouse.id);
    if (success) {
      toast({
        title: "Warehouse deleted",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        variant: "destructive"
      });
    }
  };
  const openEditDialog = (warehouse: any) => {
    selectWarehouse(warehouse);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (warehouse: any) => {
    selectWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (warehouse:any)=>{
    selectWarehouse(warehouse);
    setIsViewDialogOpen(true);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Warehouse Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Warehouse</Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[600px] md:w-full">
            <DialogHeader>
              <DialogTitle>Create New Warehouse</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="md:text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="md:text-right">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="md:text-right">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="md:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="md:text-right">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="md:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPhone" className="md:text-right">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="md:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactEmail" className="md:text-right">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="md:col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Warehouse</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-center py-4">Loading warehouses...</p>}
      {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}
      
      {/* <Card>
        <CardHeader>
          <CardTitle>Warehouses</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Location</TableHead>
                <TableHead className="whitespace-nowrap">Capacity</TableHead>
                <TableHead className="whitespace-nowrap">Current Occupancy</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.length > 0 ? (
                warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="whitespace-nowrap">{warehouse.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{warehouse.location}</TableCell>
                    <TableCell className="whitespace-nowrap">{warehouse.capacity}</TableCell>
                    <TableCell className="whitespace-nowrap">{warehouse.currentOccupancy}</TableCell>
                    <TableCell className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEditDialog(warehouse)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openDeleteDialog(warehouse)}
                      >
                        Delete
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => openViewDialog(warehouse)}
                      >
                        <Eye size={24} color="#000000" />
                      </Button>
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
      </Card> */}

{/* Warehouses Table */}
<Card className="bg-[#1C2333] border-none">
  <CardHeader>
    <CardTitle className="text-[#B6F400]">
      Warehouses ({warehouses.length})
    </CardTitle>
  </CardHeader>
  <CardContent>
    {loading ? (
      <p className="text-gray-400">Loading warehouses...</p>
    ) : error ? (
      <p className="text-red-500">Error loading warehouses: {error}</p>
    ) : warehouses.length === 0 ? (
      <p className="text-gray-400">No warehouses found matching your criteria.</p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-[#2C3444]">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Location</TableHead>
            <TableHead className="text-gray-300">Capacity</TableHead>
            <TableHead className="text-gray-300">Occupancy</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse.id} className="border-[#2C3444]">
              <TableCell>
                <div className="font-medium text-white">{warehouse.name}</div>
              </TableCell>
              <TableCell className="text-gray-300">{warehouse.location || "N/A"}</TableCell>
              <TableCell className="text-gray-300">{warehouse.capacity}</TableCell>
              <TableCell className="text-gray-300">{warehouse.currentOccupancy}</TableCell>
              <TableCell>
                {/* <Badge
                  className={`${
                    warehouse.status === "active"
                      ? "bg-green-600"
                      : "bg-gray-500"
                  } text-white`}
                >
                  {warehouse.status || "inactive"}
                </Badge> */}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* View */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#B6F400] hover:bg-[#2C3444]"
                    onClick={() => openViewDialog(warehouse)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:bg-[#2C3444]"
                    onClick={() => openEditDialog(warehouse)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Delete Warehouse
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Are you sure you want to delete '{warehouse.name}'? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#2C3444] text-white border-[#2C3444] hover:bg-[#3C4454]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteWarehouse(warehouse.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
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



      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] md:w-full">
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="md:text-right">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="md:col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="md:text-right">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="md:col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="md:text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-capacity" className="md:text-right">Capacity</Label>
                <Input
                  id="edit-capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="md:col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contactPhone" className="md:text-right">Contact Phone</Label>
                <Input
                  id="edit-contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contactEmail" className="md:text-right">Contact Email</Label>
                <Input
                  id="edit-contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="md:col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Warehouse</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] md:w-full">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this warehouse? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] md:w-full">
          <DialogHeader>
            <DialogTitle>Warehouse Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Name:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.name}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Location:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.location}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Description:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.description}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Status:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Capacity:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.capacity}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Current Occupancy:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.currentOccupancy}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Contact Phone:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.contactPhone}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Contact Email:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.contactEmail}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Created By:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.createdBy?.name}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Created At:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.createdAt ? new Date(selectedWarehouse.createdAt).toLocaleString() : "N/A"}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right font-bold">Last Updated:</Label>
              <div className="md:col-span-3">{selectedWarehouse?.updatedAt ? new Date(selectedWarehouse.updatedAt).toLocaleString() : "N/A"}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}