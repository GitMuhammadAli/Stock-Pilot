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
import { useProduct } from "@/providers/productProvider";
import { useSupplier } from "@/providers/supplierProvider";
import { useWarehouse } from "@/providers/wareHouseProvider";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { getProduct, updateProduct, loading: productLoading } = useProduct();
  const { suppliers, getAllSuppliers } = useSupplier();
  const { warehouses, getAllWarehouses } = useWarehouse();

  const [isSubmitting, setIsSubmitting] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  description: "",
  sku: "",
  barcode: "",
  price: "",
  cost: "",
  category: "",
  brand: "",
  model: "",
  dimensions: "",        
  minimumStock: "10",
  maximumStock: "100",
  supplierId: "",
  warehouseId: "",
  quantity: "0",
});

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 📦 Load product, suppliers, warehouses
useEffect(() => {
  const loadData = async () => {
    try {
      const [product, suppliersRes, warehousesRes] = await Promise.all([
        getProduct(id as string),
        getAllSuppliers(),
        getAllWarehouses(),
      ]);

      if (product) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          sku: product.sku || "",
          barcode: product.barcode || "",
          price: product.price?.toString() || "",
          cost: product.costPrice?.toString() || "",
          category: product.category || "",
          brand: product.brand || "",
          model: product.model || "",
          dimensions: product.dimensions?.toString() || "",
          minimumStock: product.minStockLevel?.toString() || "0",
          maximumStock: product.maxStockLevel?.toString() || "0",
          supplierId: product.supplierId || "",
          warehouseId: product.warehouseId || "",
          quantity: product.quantity?.toString() || "0",
        });
      }
    } catch (err) {
      toast({
        title: "Error loading data",
        description:
          err instanceof Error
            ? err.message
            : "Failed to fetch product details",
        variant: "destructive",
      });
    }
  };

  loadData();
}, [id, getProduct, getAllSuppliers, getAllWarehouses, toast]);


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
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
      await updateProduct(id as string, {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        barcode: formData.barcode,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.cost || "0"),
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        // weight: formData.weight,
        dimensions: formData.dimensions,
        minStockLevel: parseInt(formData.minimumStock),
        maxStockLevel: parseInt(formData.maximumStock),
        supplierId: formData.supplierId,
        warehouseId: formData.warehouseId,
        quantity: parseInt(formData.quantity),
      });

      toast({
        title: "Product updated!",
        description: `${formData.name} has been successfully updated.`,
      });

      router.push(`/products/${id}`);
    } catch (err) {
      toast({
        title: "Error updating product",
        description:
          err instanceof Error ? err.message : "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading product...
      </div>
    );
  }

return (
  <div className="space-y-6 w-full">
    {/* Header */}
    <div className="flex items-center space-x-4">
      <Link href={`/products`}>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:bg-[#2C3444]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </Link>
      <h1 className="text-3xl font-semibold text-white">Edit Product</h1>
    </div>

    {/* Form */}
    <div className=" w-full">
      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Name"
                field="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputGroup
                label="SKU"
                field="sku"
                required
                value={formData.sku}
                onChange={(field: string, v: string) => handleInputChange(field, v.toUpperCase())}
                errors={errors}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-[#2C3444] border-none text-white min-h-[100px]"
              />
            </div>

            {/* Pricing + Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup
                label="Price"
                field="price"
                type="number"
                required
                value={formData.price}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputGroup
                label="Cost"
                field="cost"
                type="number"
                required
                value={formData.cost}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputGroup
                label="Quantity"
                field="quantity"
                type="number"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                errors={errors}
              />
            </div>

            {/* Stock levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Minimum Stock"
                field="minimumStock"
                type="number"
                value={formData.minimumStock}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputGroup
                label="Maximum Stock"
                field="maximumStock"
                type="number"
                value={formData.maximumStock}
                onChange={handleInputChange}
                errors={errors}
              />
            </div>

            {/* Category / Brand / Model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup
                label="Category"
                field="category"
                value={formData.category}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputGroup
                label="Brand"
                field="brand"
                value={formData.brand}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputGroup
                label="Model"
                field="model"
                value={formData.model}
                onChange={handleInputChange}
                errors={errors}
              />
            </div>

            {/* Barcode, Weight, Dimensions */}
            <InputGroup
              label="Barcode"
              field="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              errors={errors}
            />
            {/* <InputGroup
              label="Weight (kg)"
              field="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              errors={errors}
            /> */}
            <div className="space-y-2">
              <Label className="text-gray-300">Dimensions</Label>
              <Textarea
                value={formData.dimensions}
                onChange={(e) => handleInputChange("dimensions", e.target.value)}
                className="bg-[#2C3444] border-none text-white min-h-[80px]"
              />
            </div>

            {/* Associations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectGroup
                label="Supplier"
                field="supplierId"
                value={formData.supplierId}
                options={suppliers}
                onChange={handleInputChange}
                errors={errors}
              />
              <SelectGroup
                label="Warehouse"
                field="warehouseId"
                value={formData.warehouseId}
                options={warehouses}
                onChange={handleInputChange}
                errors={errors}
              />
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
              <Link href={`/products/${id}`}>
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
function InputGroup({
  label,
  field,
  type = "text",
  value,
  onChange,
  errors,
}: any) {
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

function SelectGroup({ label, field, value, options, onChange, errors }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Select value={value} onValueChange={(val) => onChange(field, val)}>
        <SelectTrigger className="bg-[#2C3444] border-none text-white">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-[#2C3444] border-[#3C4454]">
          {options?.map((opt: any) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
    </div>
  );
}
