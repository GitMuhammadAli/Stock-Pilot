// src/lib/services/ProductService.ts
import { Product } from "@/db/entities/products";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";
import { Supplier } from "@/db/entities/supplier";
import { WareHouse } from "@/db/entities/wareHouse"; // Import WareHouse entity

// Interface for creating a new product
interface CreateProductData {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  sku: string;
  supplierId: string;
  warehouseId: string; // Added warehouseId as per new schema
  createdById: string;
}

// Interface for updating an existing product
interface UpdateProductData {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  sku?: string;
  supplierId?: string;
  warehouseId?: string; // Added warehouseId for updates
}

// Standardized response interface for service methods
interface ProductResponse {
  success: boolean;
  message: string;
  data?: Product | Product[] | null; // Added null for cases where data might not be found
  error?: any; // Keeping 'any' for general error catching as requested
}

export class ProductService {
  private productRepo: Repository<Product>;
  private userRepo: Repository<User>;
  private supplierRepo: Repository<Supplier>;
  private warehouseRepo: Repository<WareHouse>; // Added WareHouse repository

  constructor() {
    // Ensure AppDataSource is initialized before getting repositories
    if (!AppDataSource.isInitialized) {
      console.warn(
        "AppDataSource is not initialized. Ensure connectDB() is called before using ProductService."
      );
      // In a real application, you might want to throw an error here or handle this more robustly.
    }
    this.productRepo = AppDataSource.getRepository(Product);
    this.userRepo = AppDataSource.getRepository(User);
    this.supplierRepo = AppDataSource.getRepository(Supplier);
    this.warehouseRepo = AppDataSource.getRepository(WareHouse); // Initialize WareHouse repository
  }

  /**
   * Creates a new product entry in the database.
   * @param data - The data for the new product, including related entity IDs.
   * @returns A ProductResponse indicating success or failure, with the created product data.
   */
  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    try {
      console.log("data for product ," ,  data)
      // Validate and fetch related entities
      const user = await this.userRepo.findOne({
        where: { id: data.createdById },
      });
      console.log(user)
      if (!user) {
        return {
          success: false,
          message: `User with ID ${data.createdById} not found.`,
        };
      }

      const supplier = await this.supplierRepo.findOne({
        where: { id: data.supplierId },
      });
      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${data.supplierId} not found.`,
        };
      }

      const warehouse = await this.warehouseRepo.findOne({
        where: { id: data.warehouseId },
      });
      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${data.warehouseId} not found.`,
        };
      }

      // Create a new product instance
      const product = this.productRepo.create({
        ...data,
        createdBy: user,
        supplier: supplier,
        warehouse: warehouse, // Assign the found WareHouse entity to the relation
      });

      // Save the new product to the database
      await this.productRepo.save(product);

      return {
        success: true,
        message: "Product created successfully.",
        data: product,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: "An error occurred while creating the product.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all products from the database.
   * @returns A ProductResponse containing a list of all products.
   */
  async getAllProducts(): Promise<ProductResponse> {
    try {
      // Find all products and eager load related entities
      const products = await this.productRepo.find({
        relations: ["createdBy", "supplier", "warehouse"], // Added warehouse relation
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Products retrieved successfully.",
        data: products,
      };
    } catch (error) {
      console.error("Error retrieving all products:", error);
      return {
        success: false,
        message: "An error occurred while retrieving products.",
        error: error,
      };
    }
  }

  /**
   * Retrieves a single product by its ID.
   * @param id - The ID of the product to retrieve.
   * @returns A ProductResponse containing the found product data, or a not found message.
   */
  async getProductById(id: string): Promise<ProductResponse> {
    try {
      console.log(`Attempting to retrieve product with ID: ${id}`);
      // Find one product by ID and eager load related entities
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ["createdBy", "supplier", "warehouse"], // Added warehouse relation
      });

      if (!product) {
        return {
          success: false,
          message: `Product with ID ${id} not found.`,
          data: null, // Explicitly set data to null when not found
        };
      }

      return {
        success: true,
        message: "Product retrieved successfully.",
        data: product,
      };
    } catch (error) {
      console.error(`Error retrieving product with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving the product.",
        error: error,
      };
    }
  }

  /**
   * Updates an existing product by its ID.
   * @param id - The ID of the product to update.
   * @param data - The partial data to update the product with.
   * @returns A ProductResponse indicating success or failure, with the updated product data.
   */
  async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<ProductResponse> {
    try {
      // Find the product to update
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        return {
          success: false,
          message: `Product with ID ${id} not found.`,
        };
      }

      // Handle updates to related entities (supplier and warehouse)
      if (data.supplierId) {
        const supplier = await this.supplierRepo.findOne({
          where: { id: data.supplierId },
        });
        if (!supplier) {
          return {
            success: false,
            message: `Supplier with ID ${data.supplierId} not found.`,
          };
        }
        product.supplier = supplier;
        // No need to delete data.supplierId if you're directly assigning the entity
        // However, if you were using Object.assign for the whole data object,
        // you'd delete it to prevent overwriting the relation with just the ID.
      }

      if (data.warehouseId) {
        const warehouse = await this.warehouseRepo.findOne({
          where: { id: data.warehouseId },
        });
        if (!warehouse) {
          return {
            success: false,
            message: `Warehouse with ID ${data.warehouseId} not found.`,
          };
        }
        product.warehouse = warehouse;
      }

      // Apply other partial updates to the found product entity
      // Ensure we don't overwrite relation properties with just IDs if they were in `data`
      const { supplierId, warehouseId, ...restData } = data; // Destructure to exclude IDs from direct assignment
      Object.assign(product, restData);

      // Save the updated product
      await this.productRepo.save(product);

      return {
        success: true,
        message: "Product updated successfully.",
        data: product,
      };
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating the product.",
        error: error,
      };
    }
  }

  /**
   * Deletes a product by its ID.
   * @param id - The ID of the product to delete.
   * @returns A ProductResponse indicating success or failure.
   */
  async deleteProduct(id: string): Promise<ProductResponse> {
    try {
      // Find the product to delete
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        return {
          success: false,
          message: `Product with ID ${id} not found.`,
        };
      }

      // Remove the product from the database
      await this.productRepo.remove(product);

      return {
        success: true,
        message: "Product deleted successfully.",
      };
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while deleting the product.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all products created by a specific user.
   * @param userId - The ID of the user whose products are to be retrieved.
   * @returns A ProductResponse containing a list of products created by the user.
   */
  async getProductsByUser(userId: string): Promise<ProductResponse> {
    try {
      // Find products where createdBy relation's ID matches the provided userId
      const products = await this.productRepo.find({
        where: { createdBy: { id: userId } }, // Use nested object for relation filtering
        relations: ["createdBy", "supplier", "warehouse"],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Products for user ID ${userId} retrieved successfully.`,
        data: products,
      };
    } catch (error) {
      console.error(`Error retrieving products for user ID ${userId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving user products.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all products associated with a specific supplier.
   * @param supplierId - The ID of the supplier whose products are to be retrieved.
   * @returns A ProductResponse containing a list of products from the supplier.
   */
  async getProductsBySupplier(supplierId: string): Promise<ProductResponse> {
    try {
      // Find products where supplier relation's ID matches the provided supplierId
      const products = await this.productRepo.find({
        where: { supplier: { id: supplierId } }, // Use nested object for relation filtering
        relations: ["createdBy", "supplier", "warehouse"],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Products for supplier ID ${supplierId} retrieved successfully.`,
        data: products,
      };
    } catch (error) {
      console.error(
        `Error retrieving products for supplier ID ${supplierId}:`,
        error
      );
      return {
        success: false,
        message: "An error occurred while retrieving supplier products.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all products located in a specific warehouse.
   * @param warehouseId - The ID of the warehouse whose products are to be retrieved.
   * @returns A ProductResponse containing a list of products in the warehouse.
   */
  async getProductsByWarehouse(warehouseId: string): Promise<ProductResponse> {
    try {
      const products = await this.productRepo.find({
        where: { warehouse: { id: warehouseId } }, // Filter by warehouse relation
        relations: ["createdBy", "supplier", "warehouse"],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Products in warehouse ID ${warehouseId} retrieved successfully.`,
        data: products,
      };
    } catch (error) {
      console.error(
        `Error retrieving products for warehouse ID ${warehouseId}:`,
        error
      );
      return {
        success: false,
        message: "An error occurred while retrieving warehouse products.",
        error: error,
      };
    }
  }

  /**
   * Updates the quantity of a specific product.
   * @param id - The ID of the product to update.
   * @param newQuantity - The new quantity value.
   * @returns A ProductResponse indicating success or failure, with the updated product data.
   */
  async updateProductQuantity(
    id: string,
    newQuantity: number
  ): Promise<ProductResponse> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });

      if (!product) {
        return {
          success: false,
          message: `Product with ID ${id} not found.`,
        };
      }

      if (newQuantity < 0) {
        return {
          success: false,
          message: "Quantity cannot be negative.",
        };
      }

      product.quantity = newQuantity;
      await this.productRepo.save(product);

      return {
        success: true,
        message: "Product quantity updated successfully.",
        data: product,
      };
    } catch (error) {
      console.error(`Error updating product quantity for ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating product quantity.",
        error: error,
      };
    }
  }
}

// Export a singleton instance of the service
export const productService = new ProductService();
