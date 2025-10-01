"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 🔗 Providers
import { useOrder } from "@/providers/orderProvider";
import { useSupplier } from "@/providers/supplierProvider";
import { useWarehouse } from "@/providers/wareHouseProvider";

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { getOrder, updateOrder, loading: orderLoading } = useOrder();
  const { suppliers, getAllSuppliers } = useSupplier();
  const { warehouses, getAllWarehouses } = useWarehouse();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orderNumber: "",
    status: "pending",
    type: "purchase",
    paymentStatus: "pending",
    orderDate: "",
    dueDate: "",
    shippedDate: "",
    deliveredDate: "",
    supplierId: "",
    warehouseId: "",
    referenceNumber: "",
    notes: "",
    internalNotes: "",
    priority: "normal",
    isRushOrder: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 📦 Load order, suppliers, warehouses
  useEffect(() => {
    const loadData = async () => {
      try {
        const [order, suppliersRes, warehousesRes] = await Promise.all([
          getOrder(id as string),
          getAllSuppliers(),
          getAllWarehouses(),
        ]);

        if (order) {
          setFormData({
            orderNumber: order.orderNumber || "",
            status: order.status || "pending",
            type: order.type || "purchase",
            paymentStatus: order.paymentStatus || "pending",
            orderDate: order.orderDate?.substring(0, 10) || "",
            dueDate: order.dueDate?.substring(0, 10) || "",
            shippedDate: order.shippedDate?.substring(0, 10) || "",
            deliveredDate: order.deliveredDate?.substring(0, 10) || "",
            supplierId: order.supplierId || "",
            warehouseId: order.warehouseId || "",
            referenceNumber: order.referenceNumber || "",
            notes: order.notes || "",
            internalNotes: order.internalNotes || "",
            priority: order.priority || "normal",
            isRushOrder: order.isRushOrder || false,
          });
        }
      } catch (err) {
        toast({
          title: "Error loading data",
          description:
            err instanceof Error ? err.message : "Failed to fetch order details",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [id, getOrder, getAllSuppliers, getAllWarehouses, toast]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.orderNumber.trim()) newErrors.orderNumber = "Order number is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.type) newErrors.type = "Order type is required";
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required";
    if (!formData.warehouseId) newErrors.warehouseId = "Warehouse is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await updateOrder(id as string, {
        ...formData,
        orderDate: formData.orderDate || null,
        dueDate: formData.dueDate || null,
        shippedDate: formData.shippedDate || null,
        deliveredDate: formData.deliveredDate || null,
      });

      toast({
        title: "Order updated!",
        description: `Order ${formData.orderNumber} has been successfully updated.`,
      });

      router.push(`/orders/${id}`);
    } catch (err) {
      toast({
        title: "Error updating order",
        description: err instanceof Error ? err.message : "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading order...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/orders`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-[#2C3444]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">Edit Order</h1>
      </div>

      {/* Form */}
      <div className="w-full">
        <Card className="bg-[#1C2333] border-none">
          <CardHeader>
            <CardTitle className="text-[#B6F400]">Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Number + Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Order Number"
                  field="orderNumber"
                  required
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputGroup
                  label="Reference Number"
                  field="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>

              {/* Status, Type, Payment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectGroup
                  label="Status"
                  field="status"
                  value={formData.status}
                  options={["pending", "processing", "completed", "cancelled"]}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <SelectGroup
                  label="Order Type"
                  field="type"
                  value={formData.type}
                  options={["purchase", "sales", "return"]}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <SelectGroup
                  label="Payment Status"
                  field="paymentStatus"
                  value={formData.paymentStatus}
                  options={["pending", "paid", "failed"]}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <InputGroup
                  label="Order Date"
                  field="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputGroup
                  label="Due Date"
                  field="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputGroup
                  label="Shipped Date"
                  field="shippedDate"
                  type="date"
                  value={formData.shippedDate}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputGroup
                  label="Delivered Date"
                  field="deliveredDate"
                  type="date"
                  value={formData.deliveredDate}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>

              {/* Supplier & Warehouse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectGroup
                  label="Supplier"
                  field="supplierId"
                  value={formData.supplierId}
                  options={suppliers}
                  onChange={handleInputChange}
                  errors={errors}
                  isObject
                />
                <SelectGroup
                  label="Warehouse"
                  field="warehouseId"
                  value={formData.warehouseId}
                  options={warehouses}
                  onChange={handleInputChange}
                  errors={errors}
                  isObject
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-300">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="bg-[#2C3444] border-none text-white min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalNotes" className="text-gray-300">
                  Internal Notes
                </Label>
                <Textarea
                  id="internalNotes"
                  value={formData.internalNotes}
                  onChange={(e) =>
                    handleInputChange("internalNotes", e.target.value)
                  }
                  className="bg-[#2C3444] border-none text-white min-h-[80px]"
                />
              </div>

              {/* Priority + Rush */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectGroup
                  label="Priority"
                  field="priority"
                  value={formData.priority}
                  options={["low", "normal", "high"]}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.isRushOrder}
                    onChange={(e) =>
                      handleInputChange("isRushOrder", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label className="text-gray-300">Rush Order</Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Link href={`/orders/${id}`}>
                  <Button
                    variant="outline"
                    className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* --- Small helper components for cleaner JSX --- */
function InputGroup({ label, field, type = "text", value, onChange, errors }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="bg-[#2C3444] border-none text-white"
      />
      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
    </div>
  );
}

function SelectGroup({
  label,
  field,
  value,
  options,
  onChange,
  errors,
  isObject = false,
}: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Select value={value} onValueChange={(val) => onChange(field, val)}>
        <SelectTrigger className="bg-[#2C3444] border-none text-white">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-[#2C3444] border-[#3C4454]">
          {isObject
            ? options?.map((opt: any) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))
            : options?.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
    </div>
  );
}
