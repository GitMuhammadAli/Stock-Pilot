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
import { 
  Order, 
  OrderStatus, 
  OrderType, 
  PaymentStatus, 
  Priority, 
  UpdateOrderData 
} from "@/types";

// Helper functions to convert API string values to enum types
const convertToOrderStatus = (status: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'draft': OrderStatus.DRAFT,
    'pending': OrderStatus.PENDING,
    'confirmed': OrderStatus.CONFIRMED,
    'processing': OrderStatus.PROCESSING,
    'shipped': OrderStatus.SHIPPED,
    'delivered': OrderStatus.DELIVERED,
    'completed': OrderStatus.COMPLETED,
    'cancelled': OrderStatus.CANCELLED,
    'refunded': OrderStatus.REFUNDED,
  };
  return statusMap[status.toLowerCase()] || OrderStatus.DRAFT;
};

const convertToOrderType = (type: string): OrderType => {
  const typeMap: Record<string, OrderType> = {
    'purchase': OrderType.PURCHASE,
    'sales': OrderType.SALES,
    'transfer': OrderType.TRANSFER,
    'adjustment': OrderType.ADJUSTMENT,
    'return': OrderType.RETURN,
  };
  return typeMap[type.toLowerCase()] || OrderType.PURCHASE;
};

const convertToPaymentStatus = (status: string): PaymentStatus => {
  const statusMap: Record<string, PaymentStatus> = {
    'pending': PaymentStatus.PENDING,
    'paid': PaymentStatus.PAID,
    'partial': PaymentStatus.PARTIAL,
    'overdue': PaymentStatus.OVERDUE,
    'refunded': PaymentStatus.REFUNDED,
  };
  return statusMap[status.toLowerCase()] || PaymentStatus.PENDING;
};

const convertToPriority = (priority: string): Priority => {
  const priorityMap: Record<string, Priority> = {
    'low': 'low',
    'normal': 'normal',
    'high': 'high',
    'urgent': 'urgent',
  };
  return priorityMap[priority.toLowerCase()] || 'normal';
};

// Helper function to format date for input fields
const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return "";
  }
};

// Helper function to safely convert to number (handles both string and number inputs)
const safeToNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Create a form data interface that extends UpdateOrderData for form state
interface OrderFormData extends Omit<UpdateOrderData, 'status' | 'type' | 'paymentStatus'> {
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  paymentStatus: PaymentStatus;
  orderDate: string;
  dueDate: string;
  shippedDate: string;
  deliveredDate: string;
  supplierId: string;
  warehouseId: string;
  referenceNumber: string;
  purchaseOrderNumber: string;
  notes: string;
  internalNotes: string;
  priority: Priority;
  isRushOrder: boolean;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  shippingAddress: string;
  billingAddress: string;
  trackingNumber: string;
  shippingCarrier: string;
}

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { getOrder, updateOrder, loading: orderLoading } = useOrder();
  const { suppliers, getAllSuppliers } = useSupplier();
  const { warehouses, getAllWarehouses } = useWarehouse();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: "",
    status: OrderStatus.DRAFT,
    type: OrderType.PURCHASE,
    paymentStatus: PaymentStatus.PENDING,
    orderDate: "",
    dueDate: "",
    shippedDate: "",
    deliveredDate: "",
    supplierId: "",
    warehouseId: "",
    referenceNumber: "",
    purchaseOrderNumber: "",
    notes: "",
    internalNotes: "",
    priority: "normal",
    isRushOrder: false,
    subtotal: 0,
    taxAmount: 0,
    shippingCost: 0,
    discountAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    shippingAddress: "",
    billingAddress: "",
    trackingNumber: "",
    shippingCarrier: "",
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
            status: convertToOrderStatus(order.status || "pending"),
            type: convertToOrderType(order.type || "purchase"),
            paymentStatus: convertToPaymentStatus(order.paymentStatus || "pending"),
            orderDate: formatDateForInput(order.orderDate),
            dueDate: formatDateForInput(order.dueDate),
            shippedDate: formatDateForInput(order.shippedDate),
            deliveredDate: formatDateForInput(order.deliveredDate),
            supplierId: order.supplierId || "",
            warehouseId: order.warehouseId || "",
            referenceNumber: order.referenceNumber || "",
            purchaseOrderNumber: order.purchaseOrderNumber || "",
            notes: order.notes || "",
            internalNotes: order.internalNotes || "",
            priority: convertToPriority(order.priority || "normal"),
            isRushOrder: order.isRushOrder || false,
            subtotal: safeToNumber(order.subtotal),
            taxAmount: safeToNumber(order.taxAmount),
            shippingCost: safeToNumber(order.shippingCost),
            discountAmount: safeToNumber(order.discountAmount),
            totalAmount: safeToNumber(order.totalAmount),
            paidAmount: safeToNumber(order.paidAmount),
            shippingAddress: order.shippingAddress || "",
            billingAddress: order.billingAddress || "",
            trackingNumber: order.trackingNumber || "",
            shippingCarrier: order.shippingCarrier || "",
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

  // Generic handler for all input types
  const handleInputChange = (field: keyof OrderFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Specific handler for numeric fields
  const handleNumericChange = (field: keyof OrderFormData, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Specific handler for string fields
  const handleStringChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Specific handler for boolean fields
  const handleBooleanChange = (field: keyof OrderFormData, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.type) newErrors.type = "Order type is required";
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Convert form data to UpdateOrderData (making optional fields nullable where needed)
      const updateData: UpdateOrderData = {
        status: formData.status,
        type: formData.type,
        paymentStatus: formData.paymentStatus,
        supplierId: formData.supplierId,
        warehouseId: formData.warehouseId || null,
        orderDate: formData.orderDate || null,
        dueDate: formData.dueDate || null,
        shippedDate: formData.shippedDate || null,
        deliveredDate: formData.deliveredDate || null,
        referenceNumber: formData.referenceNumber || undefined,
        purchaseOrderNumber: formData.purchaseOrderNumber || undefined,
        notes: formData.notes || undefined,
        internalNotes: formData.internalNotes || undefined,
        priority: formData.priority,
        isRushOrder: formData.isRushOrder,
        subtotal: formData.subtotal,
        taxAmount: formData.taxAmount,
        shippingCost: formData.shippingCost,
        discountAmount: formData.discountAmount,
        totalAmount: formData.totalAmount,
        paidAmount: formData.paidAmount,
        shippingAddress: formData.shippingAddress || undefined,
        billingAddress: formData.billingAddress || undefined,
        trackingNumber: formData.trackingNumber || undefined,
        shippingCarrier: formData.shippingCarrier || undefined,
      };

      const success = await updateOrder(id as string, updateData);

      if (success) {
        toast({
          title: "Order updated!",
          description: `Order ${formData.orderNumber} has been successfully updated.`,
        });
        router.push(`/orders/${id}`);
      } else {
        throw new Error("Failed to update order");
      }
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
                <div className="space-y-2">
                  <Label className="text-gray-300">Order Number</Label>
                  <Input
                    value={formData.orderNumber}
                    readOnly
                    disabled
                    className="bg-[#2C3444] border-none text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500">Order number cannot be changed</p>
                </div>
                <InputGroup
                  label="Reference Number"
                  field="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleStringChange}
                  errors={errors}
                />
              </div>

              {/* Status, Type, Payment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectGroup
                  label="Status"
                  field="status"
                  value={formData.status}
                  options={Object.values(OrderStatus)}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <SelectGroup
                  label="Order Type"
                  field="type"
                  value={formData.type}
                  options={Object.values(OrderType)}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <SelectGroup
                  label="Payment Status"
                  field="paymentStatus"
                  value={formData.paymentStatus}
                  options={Object.values(PaymentStatus)}
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
                  onChange={handleStringChange}
                  errors={errors}
                />
                <InputGroup
                  label="Due Date"
                  field="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <InputGroup
                  label="Shipped Date"
                  field="shippedDate"
                  type="date"
                  value={formData.shippedDate}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <InputGroup
                  label="Delivered Date"
                  field="deliveredDate"
                  type="date"
                  value={formData.deliveredDate}
                  onChange={handleStringChange}
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
                  onChange={handleStringChange}
                  errors={errors}
                  isObject
                />
                <SelectGroup
                  label="Warehouse"
                  field="warehouseId"
                  value={formData.warehouseId}
                  options={warehouses}
                  onChange={handleStringChange}
                  errors={errors}
                  isObject
                />
              </div>

              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NumericInputGroup
                  label="Subtotal"
                  field="subtotal"
                  value={formData.subtotal}
                  onChange={handleNumericChange}
                  errors={errors}
                />
                <NumericInputGroup
                  label="Tax Amount"
                  field="taxAmount"
                  value={formData.taxAmount}
                  onChange={handleNumericChange}
                  errors={errors}
                />
                <NumericInputGroup
                  label="Shipping Cost"
                  field="shippingCost"
                  value={formData.shippingCost}
                  onChange={handleNumericChange}
                  errors={errors}
                />
                <NumericInputGroup
                  label="Discount Amount"
                  field="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleNumericChange}
                  errors={errors}
                />
                <NumericInputGroup
                  label="Total Amount"
                  field="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleNumericChange}
                  errors={errors}
                />
                <NumericInputGroup
                  label="Paid Amount"
                  field="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleNumericChange}
                  errors={errors}
                />
              </div>

              {/* Shipping Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Purchase Order Number"
                  field="purchaseOrderNumber"
                  value={formData.purchaseOrderNumber}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <InputGroup
                  label="Tracking Number"
                  field="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <InputGroup
                  label="Shipping Carrier"
                  field="shippingCarrier"
                  value={formData.shippingCarrier}
                  onChange={handleStringChange}
                  errors={errors}
                />
              </div>

              {/* Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaGroup
                  label="Shipping Address"
                  field="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <TextareaGroup
                  label="Billing Address"
                  field="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleStringChange}
                  errors={errors}
                />
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaGroup
                  label="Notes"
                  field="notes"
                  value={formData.notes}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <TextareaGroup
                  label="Internal Notes"
                  field="internalNotes"
                  value={formData.internalNotes}
                  onChange={handleStringChange}
                  errors={errors}
                />
              </div>

              {/* Priority + Rush */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectGroup
                  label="Priority"
                  field="priority"
                  value={formData.priority}
                  options={["low", "normal", "high", "urgent"]}
                  onChange={handleStringChange}
                  errors={errors}
                />
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.isRushOrder}
                    onChange={(e) =>
                      handleBooleanChange("isRushOrder", e.target.checked)
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

function NumericInputGroup({ label, field, value, onChange, errors }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="bg-[#2C3444] border-none text-white"
      />
      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
    </div>
  );
}

function TextareaGroup({ label, field, value, onChange, errors }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="bg-[#2C3444] border-none text-white min-h-[80px]"
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
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
    </div>
  );
}