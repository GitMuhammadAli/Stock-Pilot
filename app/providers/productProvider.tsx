// src/contexts/ProductContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductContextType,
} from "../types/index";

// Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

let productFetchCache: Record<string, Promise<Product[] | null>> = {};

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const router = useRouter();

  // Auth headers
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // --- Fetch Helper (unwraps nested API response) ---
  const handleResponse = async <T,>(response: Response): Promise<T | null> => {
    try {
      const raw = await response.json();
      console.log(raw)

      if (raw.success) {
        if (Array.isArray(raw.data?.data)) {
          return raw.data.data as T;
        }
        if (raw.data && !Array.isArray(raw.data)) {
          return raw.data as T;
        }
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

 const getAllProducts = useCallback(
  async (force = false): Promise<Product[] | null> => {
    if (!force && products.length > 0) return products; 

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/product", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) {
        setProducts(list);
        return list; // ✅ always return
      }
      return null;
    } catch (err: any) {
      setError("Failed to fetch products: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  },
  [products]
);


  const getAllProductsForUser = useCallback(async (userId: string) => {
    if (await productFetchCache[userId]) return productFetchCache[userId];

    productFetchCache[userId] = (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/product/user/${userId}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const list = await handleResponse<Product[]>(res);
        if (list) setProducts(list);
        return list;
      } catch (err: any) {
        setError("Failed to fetch products for user: " + err.message);
        return null;
      } finally {
        setLoading(false);
        delete productFetchCache[userId];
      }
    })();

    return productFetchCache[userId];
  }, []);




const getAllProductsForSupplier = useCallback(
  async (supplierId: string): Promise<Product[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/supplier/${supplierId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) setProducts(list);
      return list;
    } catch (err: any) {
      setError("Failed to fetch products for supplier: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  },
  []
);

const getAllProductsForWarehouse = useCallback(
  async (warehouseId: string): Promise<Product[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/warehouse/${warehouseId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const list = await handleResponse<Product[]>(res);
      if (list) setProducts(list);
      return list ?? null; // ✅ make sure it always returns
    } catch (err: any) {
      setError("Failed to fetch products for warehouse: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  },
  []
);




  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    if (!id) return null;

    const existing = products.find((p) => p.id === id);
    if (existing) return existing;

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
  }, [products]);

  const createProduct = useCallback(async (data: CreateProductData) => {
    const tempId = "temp-" + Date.now();
    const optimisticProduct: Product = { id: tempId, ...data } as Product;

    setProducts((prev) => [...prev, optimisticProduct]);

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const product = await handleResponse<Product>(res);
      if (product) {
        setProducts((prev) => prev.map((p) => (p.id === tempId ? product : p)));
        return true;
      }
      throw new Error("Product creation failed");
    } catch (err: any) {
      setProducts((prev) => prev.filter((p) => p.id !== tempId));
      setError("Failed to create product: " + err.message);
      return false;
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, data: UpdateProductData) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } as Product : p))
      ); // optimistic

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
        throw new Error("Update failed");
      } catch (err: any) {
        setError("Failed to update product: " + err.message);
        return false;
      }
    },
    [selectedProduct]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const prevProducts = [...products];
      setProducts((prev) => prev.filter((p) => p.id !== id)); // optimistic

      try {
        const res = await fetch(`/api/product/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        const raw = await res.json();
        if (raw.success) {
          if (selectedProduct?.id === id) setSelectedProduct(null);
          return true;
        }
        throw new Error(raw.message || "Failed to delete");
      } catch (err: any) {
        setProducts(prevProducts); // rollback
        setError("Failed to delete product: " + err.message);
        return false;
      }
    },
    [products, selectedProduct]
  );

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  // --- Derived: O(1) productMap ---
  const productMap = useMemo(() => {
    const map: Record<string, Product> = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  const value: ProductContextType = useMemo(
    () => ({
      products,
      productMap,
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
      productMap,
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

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
