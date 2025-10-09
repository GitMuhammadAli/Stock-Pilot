"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/providers/orderProvider";
import { useSupplier } from "@/providers/supplierProvider";
import { useWarehouse } from "@/providers/wareHouseProvider";

import {
  CreateOrderData,
  OrderStatus,
  OrderType,
  PaymentStatus,
  Priority,
} from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const parseNumericInput = (value: string): number => {
  if (value === '' || value === '0') return 0;
  
  // Remove leading zeros and parse
  const cleanedValue = value.replace(/^0+/, '') || '0';
  const numericValue = parseFloat(cleanedValue);
  
  return isNaN(numericValue) ? 0 : numericValue;
};

// Helper function to format numeric value for display
const formatNumericDisplay = (value: number): string => {
  return value === 0 ? '' : value.toString();
};

const CreateOrderPage = () => {
  const router = useRouter();
  const { createOrder, loading } = useOrder();
  const { suppliers, getAllSuppliers } = useSupplier();
  const { warehouses, getAllWarehouses } = useWarehouse();

  const [formData, setFormData] = useState<CreateOrderData>({
    supplierId: "",
    warehouseId: "",
    type: OrderType.PURCHASE,
    status: OrderStatus.DRAFT,
    paymentStatus: PaymentStatus.PENDING,
    priority: "normal",
    subtotal: 0,
    taxAmount: 0,
    shippingCost: 0,
    discountAmount: 0,
    totalAmount: 0,
    referenceNumber: "",
    dueDate: "",
    notes: "",
  });

  // Display values for inputs (to handle empty state and formatting)
  const [displayValues, setDisplayValues] = useState({
    subtotal: '',
    taxAmount: '',
    shippingCost: '',
    discountAmount: '',
    totalAmount: '',
  });

  // Fetch suppliers & warehouses on mount
  useEffect(() => {
    getAllSuppliers();
    getAllWarehouses();
  }, [getAllSuppliers, getAllWarehouses]);

  // Auto-update total amount when financial fields change
  useEffect(() => {
    const { subtotal, taxAmount, shippingCost, discountAmount } = formData;
    const total =
      Number(subtotal) +
      Number(taxAmount) +
      Number(shippingCost) -
      Number(discountAmount);
    
    setFormData((prev) => ({ ...prev, totalAmount: total }));
    setDisplayValues(prev => ({ ...prev, totalAmount: formatNumericDisplay(total) }));
  }, [
    formData.subtotal,
    formData.taxAmount,
    formData.shippingCost,
    formData.discountAmount,
  ]);

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Parse the numeric value (remove leading zeros)
    const numericValue = parseNumericInput(value);
    
    // Update form data with actual numeric value
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));

    // Update display value (show empty string for 0, otherwise the cleaned value)
    setDisplayValues(prev => ({
      ...prev,
      [name]: value === '' ? '' : value.replace(/^0+/, '') || ''
    }));
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.supplierId || !formData.warehouseId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Prepare data for submission - ensure all numeric values are properly formatted
    const submitData: CreateOrderData = {
      ...formData,
      subtotal: Number(formData.subtotal) || 0,
      taxAmount: Number(formData.taxAmount) || 0,
      shippingCost: Number(formData.shippingCost) || 0,
      discountAmount: Number(formData.discountAmount) || 0,
      totalAmount: Number(formData.totalAmount) || 0,
    };

    console.log("Submitting order data:", submitData);

    try {
      const success = await createOrder(submitData);

      if (success) {
        toast.success("Order created successfully!");
        router.push("/orders");
      } else {
        toast.error("Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An error occurred while creating the order.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-lg border border-gray-200 bg-[#1C2230] text-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-white">
            Create New Order
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ─── Basic Info ──────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Order Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: OrderType) =>
                    handleSelectChange("type", v)
                  }
                >
                  <SelectTrigger className="bg-[#2C3444] border border-gray-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderType.PURCHASE}>Purchase</SelectItem>
                    <SelectItem value={OrderType.SALES}>Sales</SelectItem>
                    <SelectItem value={OrderType.TRANSFER}>Transfer</SelectItem>
                    <SelectItem value={OrderType.ADJUSTMENT}>Adjustment</SelectItem>
                    <SelectItem value={OrderType.RETURN}>Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: OrderStatus) =>
                    handleSelectChange("status", v)
                  }
                >
                  <SelectTrigger className="bg-[#2C3444] border border-gray-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                    <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                    <SelectItem value={OrderStatus.REFUNDED}>Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Status *</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(v: PaymentStatus) =>
                    handleSelectChange("paymentStatus", v)
                  }
                >
                  <SelectTrigger className="bg-[#2C3444] border border-gray-600">
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                    <SelectItem value={PaymentStatus.PARTIAL}>Partial</SelectItem>
                    <SelectItem value={PaymentStatus.OVERDUE}>Overdue</SelectItem>
                    <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ─── Supplier Dropdown ──────────────────────────────── */}
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(v) =>
                    handleSelectChange("supplierId", v)
                  }
                >
                  <SelectTrigger className="bg-[#2C3444] border border-gray-600">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers?.length ? (
                      suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-suppliers" disabled>
                        No suppliers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* ─── Warehouse Dropdown ──────────────────────────────── */}
              <div className="space-y-2">
                <Label>Warehouse *</Label>
                <Select
                  value={formData.warehouseId}
                  onValueChange={(v) =>
                    handleSelectChange("warehouseId", v)
                  }
                >
                  <SelectTrigger className="bg-[#2C3444] border border-gray-600">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses?.length ? (
                      warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-warehouses" disabled>
                        No warehouses found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ─── Financial Fields ──────────────────────────────── */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-white">
                Financial Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Subtotal", name: "subtotal" },
                  { label: "Tax Amount", name: "taxAmount" },
                  { label: "Shipping Cost", name: "shippingCost" },
                  { label: "Discount Amount", name: "discountAmount" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      name={field.name}
                      value={displayValues[field.name as keyof typeof displayValues]}
                      onChange={handleNumericChange}
                      placeholder="0"
                      className="bg-[#2C3444] border border-gray-600 text-gray-100"
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input
                    type="text"
                    name="totalAmount"
                    value={displayValues.totalAmount}
                    readOnly
                    placeholder="0"
                    className="bg-[#2C3444] border border-gray-600 text-gray-100 bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* ─── Additional Info ──────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: Priority) =>
                    handleSelectChange("priority", v)
                  }
                >
                  <SelectTrigger className="bg-[#2C3444] border border-gray-600">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleTextChange}
                  placeholder="REF-001"
                  className="bg-[#2C3444] border border-gray-600 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleTextChange}
                  className="bg-[#2C3444] border border-gray-600 text-gray-100"
                />
              </div>
            </div>

            {/* ─── Notes ──────────────────────────────── */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleTextChange}
                placeholder="Order notes or special instructions..."
                rows={4}
                className="bg-[#2C3444] border border-gray-600 text-gray-100"
              />
            </div>

            {/* ─── Submit ──────────────────────────────── */}
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="min-w-32"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Order"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrderPage;