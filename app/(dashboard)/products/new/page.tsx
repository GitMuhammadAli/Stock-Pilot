"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWarehouse } from "@/providers/wareHouseProvider";
import { useSupplier } from "@/providers/supplierProvider";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { suppliers, loading: supplierLoading } = useSupplier();
  const { warehouses, loading: warehouseLoading } = useWarehouse();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Add quantity in form state
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
    weight: "",
    dimensions: "",
    minimumStock: "10",
    maximumStock: "100",
    supplierId: "",
    warehouseId: "",
    quantity: "0",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.price || Number(formData.price) < 0) newErrors.price = "Invalid price";
    if (!formData.cost || Number(formData.cost) < 0) newErrors.cost = "Invalid cost";
    if (!formData.supplierId) newErrors.supplierId = "Supplier required";
    if (!formData.warehouseId) newErrors.warehouseId = "Warehouse required";
    if (formData.quantity === "" || Number(formData.quantity) < 0) newErrors.quantity = "Quantity must be 0 or more";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        minimumStock: parseInt(formData.minimumStock),
        maximumStock: parseInt(formData.maximumStock),
        quantity: parseInt(formData.quantity), // ✅ Ensure number
      };

      console.log("Submitting Product:", payload);

      // TODO: replace with actual API call
      await fetch("/api/product", { method: "POST", body: JSON.stringify(payload) });

      toast({
        title: "Product Created!",
        description: `${formData.name} has been added.`,
      });

      router.push("/products");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Invalid fields",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (supplierLoading || warehouseLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#B6F400]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/products">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-[#2C3444]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-white">Add New Product</h1>
      </div>

      <Card className="bg-[#1C2333] border-none">
        <CardHeader>
          <CardTitle className="text-[#B6F400]">Product Information</CardTitle>
        </CardHeader>
        <CardContent className="overflow-visible">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Product Name" required value={formData.name} onChange={(v: string) => handleInputChange("name", v)} error={errors.name} />
              <InputField label="SKU" required value={formData.sku} onChange={(v: string) => handleInputChange("sku", v.toUpperCase())} error={errors.sku} />
            </div>

            <TextareaField label="Description" value={formData.description} onChange={(v: string) => handleInputChange("description", v)} />

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Price" type="number" required value={formData.price} onChange={(v: string) => handleInputChange("price", v)} error={errors.price} />
              <InputField label="Cost" type="number" required value={formData.cost} onChange={(v: string) => handleInputChange("cost", v)} error={errors.cost} />
            </div>

            {/* Category / Brand / Model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Category" value={formData.category} onChange={(v: string) => handleInputChange("category", v)} />
              <InputField label="Brand" value={formData.brand} onChange={(v: string) => handleInputChange("brand", v)} />
              <InputField label="Model" value={formData.model} onChange={(v: string) => handleInputChange("model", v)} />
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Minimum Stock" type="number" value={formData.minimumStock} onChange={(v: string) => handleInputChange("minimumStock", v)} />
              <InputField label="Maximum Stock" type="number" value={formData.maximumStock} onChange={(v: string) => handleInputChange("maximumStock", v)} />
              <InputField label="Quantity" type="number" required value={formData.quantity} onChange={(v: string) => handleInputChange("quantity", v)} error={errors.quantity} /> {/* ✅ NEW */}
            </div>

            {/* Barcode, Weight, Dimensions */}
            <InputField label="Barcode" value={formData.barcode} onChange={(v: string) => handleInputChange("barcode", v)} />
            <InputField label="Weight (kg)" type="number" value={formData.weight} onChange={(v: string) => handleInputChange("weight", v)} />
            <TextareaField label="Dimensions (string)" value={formData.dimensions} onChange={(v: string) => handleInputChange("dimensions", v)} />

            {/* Supplier + Warehouse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Supplier"
                value={formData.supplierId}
                options={suppliers.map((s: any) => ({ value: s.id.toString(), label: s.name }))}
                onChange={(v: string) => handleInputChange("supplierId", v)}
                error={errors.supplierId}
              />
              <SelectField
                label="Warehouse"
                value={formData.warehouseId}
                options={warehouses.map((w: any) => ({ value: w.id.toString(), label: w.name }))}
                onChange={(v: string) => handleInputChange("warehouseId", v)}
                error={errors.warehouseId}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSubmitting ? "Saving..." : "Create Product"}
              </Button>
              <Link href="/products">
                <Button type="button" variant="outline" className="border-[#2C3444] text-white hover:bg-[#2C3444] bg-transparent">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* --- Reusable components --- */
function InputField({ label, value, onChange, error, type = "text", required = false }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input value={value} type={type} onChange={(e) => onChange(e.target.value)} className="bg-[#2C3444] border-none text-white" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function TextareaField({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="bg-[#2C3444] border-none text-white min-h-[80px]" />
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }: any) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#2C3444] border-none text-white">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-[#2C3444] border-[#3C4454]">
          {options.map((opt: any) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
