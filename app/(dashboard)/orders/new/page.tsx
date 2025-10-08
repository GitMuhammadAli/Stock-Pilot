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

// Generate order number function
const generateOrderNumber = (): string => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const CreateOrderPage = () => {
  const router = useRouter();
  const { createOrder, loading } = useOrder();
  const { suppliers, getAllSuppliers } = useSupplier();
  const { warehouses, getAllWarehouses } = useWarehouse();

  // For now, use a temporary user ID - replace with your actual auth system
  const tempUserId = "b97567c3-966a-4ab3-b550-c08a2f3e28d5";

  const [formData, setFormData] = useState<CreateOrderData>({
    orderNumber: generateOrderNumber(),
    createdById: tempUserId,
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

  // Fetch suppliers & warehouses on mount
  useEffect(() => {
    getAllSuppliers();
    getAllWarehouses();
  }, [getAllSuppliers, getAllWarehouses]);

  // Auto-update total amount
  useEffect(() => {
    const { subtotal, taxAmount, shippingCost, discountAmount } = formData;
    const total =
      Number(subtotal) +
      Number(taxAmount) +
      Number(shippingCost) -
      Number(discountAmount);
    setFormData((prev) => ({ ...prev, totalAmount: total }));
  }, [
    formData.subtotal,
    formData.taxAmount,
    formData.shippingCost,
    formData.discountAmount,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.orderNumber ||
      !formData.supplierId ||
      !formData.warehouseId ||
      !formData.createdById
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    console.log("Submitting order data:", formData);

    const success = await createOrder(formData);

    if (success) {
      toast.success("Order created successfully!");
      router.push("/dashboard/orders");
    } else {
      toast.error("Failed to create order.");
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
                <Label>Order Number</Label>
                <Input
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="ORD-00123"
                  required
                  className="bg-[#2C3444] border border-gray-600 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: OrderType) =>
                    setFormData((p) => ({ ...p, type: v }))
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
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: OrderStatus) =>
                    setFormData((p) => ({ ...p, status: v }))
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
                <Label>Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(v: PaymentStatus) =>
                    setFormData((p) => ({ ...p, paymentStatus: v }))
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
                <Label>Supplier</Label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, supplierId: v }))
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
                      <SelectItem value="">No suppliers found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* ─── Warehouse Dropdown ──────────────────────────────── */}
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select
                  value={formData.warehouseId}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, warehouseId: v }))
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
                      <SelectItem value="">No warehouses found</SelectItem>
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
                  { label: "Tax", name: "taxAmount" },
                  { label: "Shipping", name: "shippingCost" },
                  { label: "Discount", name: "discountAmount" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      className="bg-[#2C3444] border border-gray-600 text-gray-100"
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    readOnly
                    className="bg-[#2C3444] border border-gray-600 text-gray-100"
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
                    setFormData((p) => ({ ...p, priority: v }))
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Order notes or special instructions..."
                rows={4}
                className="bg-[#2C3444] border border-gray-600 text-gray-100"
              />
            </div>

            {/* ─── Submit ──────────────────────────────── */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
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