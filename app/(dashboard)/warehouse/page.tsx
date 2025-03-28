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


import { Eye } from "@deemlol/next-icons";
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
        contactEmail: ''
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Warehouse Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Warehouse</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Warehouse</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPhone" className="text-right">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactEmail" className="text-right">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="col-span-3"
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
                <TableHead>Capacity</TableHead>
                <TableHead>Current Occupancy</TableHead>
                <TableHead>Actions</TableHead>
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
                    <TableCell className="flex space-x-2">
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
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-capacity" className="text-right">Capacity</Label>
                <Input
                  id="edit-capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contactPhone" className="text-right">Contact Phone</Label>
                <Input
                  id="edit-contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contactEmail" className="text-right">Contact Email</Label>
                <Input
                  id="edit-contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="col-span-3"
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
        <DialogContent>
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Warehouse Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Name:</Label>
                    <div className="col-span-3">{selectedWarehouse?.name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Location:</Label>
                    <div className="col-span-3">{selectedWarehouse?.location}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Description:</Label>
                    <div className="col-span-3">{selectedWarehouse?.description}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Status:</Label>
                    <div className="col-span-3">{selectedWarehouse?.isActive ? 'Active' : 'Inactive'}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Capacity:</Label>
                    <div className="col-span-3">{selectedWarehouse?.capacity}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Current Occupancy:</Label>
                    <div className="col-span-3">{selectedWarehouse?.currentOccupancy}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Contact Phone:</Label>
                    <div className="col-span-3">{selectedWarehouse?.contactPhone}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Contact Email:</Label>
                    <div className="col-span-3">{selectedWarehouse?.contactEmail}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Created By:</Label>
                    <div className="col-span-3">{selectedWarehouse?.createdBy?.name}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Created At:</Label>
                    <div className="col-span-3">{selectedWarehouse?.createdAt ? new Date(selectedWarehouse.createdAt).toLocaleString() : "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Last Updated:</Label>
                    <div className="col-span-3">{selectedWarehouse?.updatedAt ? new Date(selectedWarehouse.updatedAt).toLocaleString():"N/A"}</div>
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
