import { Product } from "@/db/entities/products";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";
import { Supplier } from "@/db/entities/supplier";

interface CreateProductData {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  sku: string;
  supplierId: string;
  createdById: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  sku?: string;
  supplierId?: string;
}

interface ProductResponse {
  success: boolean;
  message: string;
  data?: Product | Product[];
  error?: any;
}

export class ProductService {
  private productRepo: Repository<Product>;
  private userRepo: Repository<User>;
  private supplierRepo: Repository<Supplier>;

  constructor() {
    this.productRepo = AppDataSource.getRepository(Product);
    this.userRepo = AppDataSource.getRepository(User);
    this.supplierRepo = AppDataSource.getRepository(Supplier);
  }

  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    try {
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const supplier = await this.supplierRepo.findOne({ where: { id: data.supplierId } });
      if (!supplier) {
        return {
          success: false,
          message: "Supplier not found",
        };
      }

      const product = this.productRepo.create({
        ...data,
        createdBy: user,
        supplier: supplier,
      });

      await this.productRepo.save(product);

      return {
        success: true,
        message: "Product created successfully",
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while creating the product",
        error: error
      };
    }
  }

  async getAllProducts(): Promise<ProductResponse> {
    try {
      const products = await this.productRepo.find({
        relations: ['createdBy', 'supplier'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Products retrieved successfully",
        data: products,
      };
    } catch (error) {
      console.error("Error retrieving products:", error);
      return {
        success: false,
        message: "An error occurred while retrieving products",
      };
    }
  }

  async getProductById(id: string): Promise<ProductResponse> {
    try {
      console.log("product id is ", id)
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ['createdBy', 'supplier'],
      });

      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      return {
        success: true,
        message: "Product retrieved successfully",
        data: product,
      };
    } catch (error) {
      console.error("Error retrieving product:", error);
      return {
        success: false,
        message: "An error occurred while retrieving the product",
      };
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<ProductResponse> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      if (data.supplierId) {
        const supplier = await this.supplierRepo.findOne({ where: { id: data.supplierId } });
        if (!supplier) {
          return {
            success: false,
            message: "Supplier not found",
          };
        }
        product.supplier = supplier;
        delete data.supplierId;
      }

      Object.assign(product, data);
      await this.productRepo.save(product);

      return {
        success: true,
        message: "Product updated successfully",
        data: product,
      };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: "An error occurred while updating the product",
      };
    }
  }

  async deleteProduct(id: string): Promise<ProductResponse> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      await this.productRepo.remove(product);

      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "An error occurred while deleting the product",
      };
    }
  }

  async getProductsByUser(userId: string): Promise<ProductResponse> {
    try {
      const products = await this.productRepo.find({
        where: { createdBy: { id: userId } },
        relations: ['createdBy', 'supplier'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Products retrieved successfully",
        data: products,
      };
    } catch (error) {
      console.error("Error retrieving user products:", error);
      return {
        success: false,
        message: "An error occurred while retrieving user products",
      };
    }
  }

  async getProductsBySupplier(supplierId: string): Promise<ProductResponse> {
    try {
      const products = await this.productRepo.find({
        where: { supplier: { id: supplierId } },
        relations: ['createdBy', 'supplier'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Products retrieved successfully",
        data: products,
      };
    } catch (error) {
      console.error("Error retrieving supplier products:", error);
      return {
        success: false,
        message: "An error occurred while retrieving supplier products",
      };
    }
  }

  async updateProductQuantity(id: string, newQuantity: number): Promise<ProductResponse> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      if (newQuantity < 0) {
        return {
          success: false,
          message: "Quantity cannot be negative",
        };
      }

      product.quantity = newQuantity;
      await this.productRepo.save(product);

      return {
        success: true,
        message: "Product quantity updated successfully",
        data: product,
      };
    } catch (error) {
      console.error("Error updating product quantity:", error);
      return {
        success: false,
        message: "An error occurred while updating product quantity",
      };
    }
  }
}