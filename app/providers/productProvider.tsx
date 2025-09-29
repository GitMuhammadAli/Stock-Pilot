// src/contexts/ProductContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

// Import your defined types
import {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductContextType,
} from "../types/index"; // adjust path

// Create Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const router = useRouter();

  // Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // --- Fetch Helper (unwraps your nested response) ---
  const handleResponse = async <T,>(
    response: Response
  ): Promise<T | null> => {
    try {
      const raw = await response.json();
      // expected shape: { success, data: { success, message, data: [...] } }
      if (raw.success && raw.data?.data) {
        return raw.data.data as T;
      }
      console.error("API error:", raw);
      setError(raw.message || "Unexpected API response");
      return null;
    } catch (err: any) {
      console.error("Parse error:", err);
      setError("Invalid server response");
      return null;
    }
  };

  // --- CRUD OPERATIONS ---

  const getAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/product", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) setProducts(list);
    } catch (err: any) {
      setError("Failed to fetch products: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllProductsForUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/user/${userId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) setProducts(list);
    } catch (err: any) {
      setError("Failed to fetch products for user: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllProductsForSupplier = useCallback(async (supplierId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/supplier/${supplierId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) setProducts(list);
    } catch (err: any) {
      setError("Failed to fetch products for supplier: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllProductsForWarehouse = useCallback(async (warehouseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/warehouse/${warehouseId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) setProducts(list);
    } catch (err: any) {
      setError("Failed to fetch products for warehouse: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const product = await handleResponse<Product>(res);
      return product || null;
    } catch (err: any) {
      setError("Failed to fetch product: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: CreateProductData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const product = await handleResponse<Product>(res);
      if (product) {
        setProducts((prev) => [...prev, product]);
        return true;
      }
      return false;
    } catch (err: any) {
      setError("Failed to create product: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, data: UpdateProductData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/product/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        const updated = await handleResponse<Product>(res);
        if (updated) {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
          );
          if (selectedProduct?.id === id) setSelectedProduct(updated);
          return true;
        }
        return false;
      } catch (err: any) {
        setError("Failed to update product: " + err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [selectedProduct]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/product/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        const raw = await res.json();
        if (raw.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          if (selectedProduct?.id === id) setSelectedProduct(null);
          return true;
        }
        setError(raw.message || "Failed to delete product");
        return false;
      } catch (err: any) {
        setError("Failed to delete product: " + err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [selectedProduct]
  );

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const value: ProductContextType = useMemo(
    () => ({
      products,
      loading,
      error,
      selectedProduct,
      createProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getAllProducts,
      getAllProductsForUser,
      getAllProductsForSupplier,
      getAllProductsForWarehouse,
      selectProduct,
    }),
    [
      products,
      loading,
      error,
      selectedProduct,
      createProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getAllProducts,
      getAllProductsForUser,
      getAllProductsForSupplier,
      getAllProductsForWarehouse,
      selectProduct,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
