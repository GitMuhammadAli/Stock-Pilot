import { Product } from "@/db/entities/products";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";

interface CreateProductData {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  userId: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
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

  constructor() {
    this.productRepo = AppDataSource.getRepository(Product);
    this.userRepo = AppDataSource.getRepository(User);
  }

  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    try {
      const user = await this.userRepo.findOne({ where: { id: data.userId } });
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const product = this.productRepo.create({
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        price: data.price,
        category: data.category,
        user: user,
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
        relations: ['user'],
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
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ['user'],
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
        where: { user: { id: userId } },
        relations: ['user'],
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
}