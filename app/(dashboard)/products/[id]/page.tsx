"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  Building2,
  Warehouse,
  Calendar,
  Tag,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { useProduct } from "@/providers/productProvider";

type StockMovement = {
  id: number;
  date: string;
  type: string;
  quantity: number;
  reason: string;
  user: string;
  balanceAfter: number;
};

type RelatedProduct = {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  supplier: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { products, loading, error, getAllProducts } = useProduct();

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  // 🔄 Fetch all products once
  useEffect(() => {
    if (!products || products.length === 0) {
      getAllProducts();
    }
  }, [getAllProducts, products]);

  // 🎯 Find the current product from context
  const product = products?.find((p: any) => String(p.id) === String(id));

  // Dummy movement + related data (until backend provides it)
  useEffect(() => {
    if (product) {
      setStockMovements([
        {
          id: 1,
          date: "2025-09-01",
          type: "Inbound",
          quantity: 50,
          reason: "Supplier delivery",
          user: "Admin",
          balanceAfter: product.quantity + 50,
        },
        {
          id: 2,
          date: "2025-09-10",
          type: "Outbound",
          quantity: -10,
          reason: "Customer order",
          user: "Ali",
          balanceAfter: product.quantity - 10,
        },
      ]);

      setRelatedProducts(
        products
          .filter(
            (p: any) => p.category === product.category && p.id !== product.id
          )
          .slice(0, 3) // show 3 related
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            price: p.price,
            quantity: p.quantity,
            supplier: p.supplier?.name || "Unknown",
          }))
      );
    }
  }, [product, products]);

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { status: "Out of Stock", color: "bg-red-500" };
    if (quantity <= minStock * 0.5)
      return { status: "Critical", color: "bg-orange-500" };
    if (quantity <= minStock)
      return { status: "Low Stock", color: "bg-yellow-500" };
    return { status: "In Stock", color: "bg-green-500" };
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "Inbound":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Outbound":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "Transfer":
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
      case "Adjustment":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading)
    return <div className="text-gray-400">Loading product details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-red-500">Product not found</div>;

  const stockStatus = getStockStatus(product.quantity, product.minStock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/products">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:bg-[#2C3444]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-white">
              {product.name}
            </h1>
            <p className="text-gray-400 font-mono">{product.sku}</p>
          </div>
          <Badge className={`${stockStatus.color} text-white`}>
            {stockStatus.status}
          </Badge>
        </div>
        <Link href={`/products/${product.id}/edit`}>
          <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1C2333] border-none">
            <CardHeader>
              <CardTitle className="text-[#B6F400] flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-gray-300">{product.description}</p>
                  <div className="flex items-center text-gray-300">
                    <Tag className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{product.category}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Building2 className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{product.supplier?.name}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Warehouse className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <span>{product.warehouse?.name}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-[#B6F400]" />
                    <div>
                      <p className="text-sm">
                        Created:{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        Updated:{" "}
                        {new Date(product.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {product.quantity <= product.minStock && (
                    <div className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-yellow-500 text-sm font-medium">
                          Low Stock Alert
                        </p>
                        <p className="text-yellow-400 text-xs">
                          Current stock ({product.quantity}) is at or below
                          minimum level ({product.minStock})
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock + Financial */}
        <div className="space-y-6">
          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {product.quantity}
                </div>
                <p className="text-sm text-gray-400">Current Stock</p>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Minimum Stock:</span>
                  <span className="text-white">{product.minStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="text-white">{product.quantity}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C2333] border-none">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-white">Financial</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span className="text-white">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span className="text-white font-medium">
                    ${product.totalValue?.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Movements + Related */}
      <Card className="bg-[#1C2333] border-none">
        <CardContent className="p-6">
          <Tabs defaultValue="movements" className="w-full">
            <TabsList className="bg-[#2C3444] border-none">
              <TabsTrigger
                value="movements"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Stock Movements ({stockMovements.length})
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
              >
                Related Products ({relatedProducts.length})
              </TabsTrigger>
            </TabsList>

            {/* Movements */}
            <TabsContent value="movements" className="mt-6">
              {stockMovements.length === 0 ? (
                <p className="text-gray-400 text-sm">No stock movements yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2C3444]">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Quantity</TableHead>
                      <TableHead className="text-gray-300">Reason</TableHead>
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">
                        Balance After
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id} className="border-[#2C3444]">
                        <TableCell className="text-gray-300">
                          {movement.date}
                        </TableCell>
                        <TableCell className="text-gray-300 flex items-center">
                          {getMovementIcon(movement.type)}
                          <span className="ml-2">{movement.type}</span>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${
                            movement.quantity > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {movement.quantity > 0 ? "+" : ""}
                          {movement.quantity}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {movement.reason}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {movement.user}
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {movement.balanceAfter}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Related */}
            <TabsContent value="related" className="mt-6">
              {relatedProducts.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No related products found
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2C3444]">
                      <TableHead className="text-gray-300">Product</TableHead>
                      <TableHead className="text-gray-300">SKU</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Stock</TableHead>
                      <TableHead className="text-gray-300">Supplier</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedProducts.map((rp) => (
                      <TableRow key={rp.id} className="border-[#2C3444]">
                        <TableCell className="text-white font-medium">
                          {rp.name}
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">
                          {rp.sku}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          ${rp.price}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {rp.quantity}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {rp.supplier}
                        </TableCell>
                        <TableCell>
                          <Link href={`/products/${rp.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#B6F400] hover:bg-[#2C3444]"
                            >
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
