// src/lib/services/OrderItemService.ts
import { OrderItem } from "@/db/entities/orderItem";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { Order } from "@/db/entities/order";
import { Product } from "@/db/entities/products";

// Interface for creating a new order item
interface CreateOrderItemData {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

// Interface for updating an existing order item
interface UpdateOrderItemData {
  orderId?: string;
  productId?: string;
  quantity?: number;
  unitPrice?: number;
}

// Standardized response interface for service methods
interface OrderItemResponse {
  success: boolean;
  message: string;
  data?: OrderItem | OrderItem[] | { orderId: string; total: number; itemCount: number } | { total: number } | null; // Added null and specific types for calculated data
  error?: any; // Keeping 'any' for general error catching as requested
}

export class OrderItemService {
  private orderItemRepo: Repository<OrderItem>;
  private orderRepo: Repository<Order>;
  private productRepo: Repository<Product>;

  constructor() {
    // Ensure AppDataSource is initialized before getting repositories
    if (!AppDataSource.isInitialized) {
      console.warn("AppDataSource is not initialized. Ensure connectDB() is called before using OrderItemService.");
      // In a real application, you might want to throw an error here or handle this more robustly.
    }
    this.orderItemRepo = AppDataSource.getRepository(OrderItem);
    this.orderRepo = AppDataSource.getRepository(Order);
    this.productRepo = AppDataSource.getRepository(Product);
  }

  /**
   * Creates a new order item entry in the database.
   * @param data - The data for the new order item, including related entity IDs.
   * @returns An OrderItemResponse indicating success or failure, with the created order item data.
   */
  async createOrderItem(data: CreateOrderItemData): Promise<OrderItemResponse> {
    try {
      // Validate and fetch related entities
      const order = await this.orderRepo.findOne({ where: { id: data.orderId } });
      if (!order) {
        return {
          success: false,
          message: `Order with ID ${data.orderId} not found.`,
        };
      }

      const product = await this.productRepo.findOne({ where: { id: data.productId } });
      if (!product) {
        return {
          success: false,
          message: `Product with ID ${data.productId} not found.`,
        };
      }

      // Validate quantity and unit price
      if (data.quantity <= 0) {
        return {
          success: false,
          message: "Quantity must be greater than 0.",
        };
      }

      if (data.unitPrice < 0) {
        return {
          success: false,
          message: "Unit price cannot be negative.",
        };
      }

      // Create a new order item instance
      const orderItem = this.orderItemRepo.create({
        order: order,
        orderId: data.orderId, // Explicitly set foreign key
        product: product,
        productId: data.productId, // Explicitly set foreign key
        quantity: data.quantity,
        unitPrice: data.unitPrice,
      });

      // Save the new order item to the database
      await this.orderItemRepo.save(orderItem);

      return {
        success: true,
        message: "Order item created successfully.",
        data: orderItem,
      };
    } catch (error) {
      console.error("Error creating order item:", error);
      return {
        success: false,
        message: "An error occurred while creating the order item.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all order items from the database.
   * @returns An OrderItemResponse containing a list of all order items.
   */
  async getAllOrderItems(): Promise<OrderItemResponse> {
    try {
      // Find all order items and eager load related entities
      const orderItems = await this.orderItemRepo.find({
        relations: ['order', 'product'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Order items retrieved successfully.",
        data: orderItems,
      };
    } catch (error) {
      console.error("Error retrieving all order items:", error);
      return {
        success: false,
        message: "An error occurred while retrieving order items.",
        error: error,
      };
    }
  }

  /**
   * Retrieves a single order item by its ID.
   * @param id - The ID of the order item to retrieve.
   * @returns An OrderItemResponse containing the found order item data, or a not found message.
   */
  async getOrderItemById(id: string): Promise<OrderItemResponse> {
    try {
      console.log(`Attempting to retrieve order item with ID: ${id}`);
      // Find one order item by ID and eager load related entities
      const orderItem = await this.orderItemRepo.findOne({
        where: { id },
        relations: ['order', 'product'],
      });

      if (!orderItem) {
        return {
          success: false,
          message: `Order item with ID ${id} not found.`,
          data: null, // Explicitly set data to null when not found
        };
      }

      return {
        success: true,
        message: "Order item retrieved successfully.",
        data: orderItem,
      };
    } catch (error) {
      console.error(`Error retrieving order item with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving the order item.",
        error: error,
      };
    }
  }

  /**
   * Updates an existing order item by its ID.
   * @param id - The ID of the order item to update.
   * @param data - The partial data to update the order item with.
   * @returns An OrderItemResponse indicating success or failure, with the updated order item data.
   */
  async updateOrderItem(id: string, data: UpdateOrderItemData): Promise<OrderItemResponse> {
    try {
      const orderItem = await this.orderItemRepo.findOne({ where: { id } });

      if (!orderItem) {
        return {
          success: false,
          message: `Order item with ID ${id} not found.`,
        };
      }

      // Handle updates to related entities (order and product)
      if (data.orderId) {
        const order = await this.orderRepo.findOne({ where: { id: data.orderId } });
        if (!order) {
          return {
            success: false,
            message: `Order with ID ${data.orderId} not found.`,
          };
        }
        orderItem.order = order;
        orderItem.orderId = data.orderId; // Update foreign key
      }

      if (data.productId) {
        const product = await this.productRepo.findOne({ where: { id: data.productId } });
        if (!product) {
          return {
            success: false,
            message: `Product with ID ${data.productId} not found.`,
          };
        }
        orderItem.product = product;
        orderItem.productId = data.productId; // Update foreign key
      }

      // Validate quantity and unit price if they are being updated
      if (data.quantity !== undefined) {
        if (data.quantity <= 0) {
          return {
            success: false,
            message: "Quantity must be greater than 0.",
          };
        }
      }

      if (data.unitPrice !== undefined) {
        if (data.unitPrice < 0) {
          return {
            success: false,
            message: "Unit price cannot be negative.",
          };
        }
      }

      // Apply other partial updates to the found order item entity
      // Destructure to exclude relation IDs from direct Object.assign
      const { orderId, productId, ...restData } = data;
      Object.assign(orderItem, restData);

      await this.orderItemRepo.save(orderItem);

      return {
        success: true,
        message: "Order item updated successfully.",
        data: orderItem,
      };
    } catch (error) {
      console.error(`Error updating order item with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating the order item.",
        error: error,
      };
    }
  }

  /**
   * Deletes an order item by its ID.
   * @param id - The ID of the order item to delete.
   * @returns An OrderItemResponse indicating success or failure.
   */
  async deleteOrderItem(id: string): Promise<OrderItemResponse> {
    try {
      const orderItem = await this.orderItemRepo.findOne({ where: { id } });

      if (!orderItem) {
        return {
          success: false,
          message: `Order item with ID ${id} not found.`,
        };
      }

      await this.orderItemRepo.remove(orderItem);

      return {
        success: true,
        message: "Order item deleted successfully.",
      };
    } catch (error) {
      console.error(`Error deleting order item with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while deleting the order item.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all order items belonging to a specific order.
   * @param orderId - The ID of the order whose items are to be retrieved.
   * @returns An OrderItemResponse containing a list of order items for the specified order.
   */
  async getOrderItemsByOrder(orderId: string): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        where: { order: { id: orderId } }, // Filter by order relation
        relations: ['order', 'product'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Order items for order ID ${orderId} retrieved successfully.`,
        data: orderItems,
      };
    } catch (error) {
      console.error(`Error retrieving order items for order ID ${orderId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving order items by order.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all order items associated with a specific product.
   * @param productId - The ID of the product whose order items are to be retrieved.
   * @returns An OrderItemResponse containing a list of order items for the specified product.
   */
  async getOrderItemsByProduct(productId: string): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        where: { product: { id: productId } }, // Filter by product relation
        relations: ['order', 'product'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Order items for product ID ${productId} retrieved successfully.`,
        data: orderItems,
      };
    } catch (error) {
      console.error(`Error retrieving order items for product ID ${productId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving order items by product.",
        error: error,
      };
    }
  }

  /**
   * Calculates the total price for a single order item (quantity * unitPrice).
   * @param id - The ID of the order item to calculate the total for.
   * @returns An OrderItemResponse containing the calculated total.
   */
  async calculateOrderItemTotal(id: string): Promise<OrderItemResponse> {
    try {
      const orderItem = await this.orderItemRepo.findOne({ where: { id } });

      if (!orderItem) {
        return {
          success: false,
          message: `Order item with ID ${id} not found.`,
          data: null,
        };
      }

      const total = orderItem.quantity * orderItem.unitPrice;

      // Return a specific object for the total, not the whole orderItem
      return {
        success: true,
        message: "Order item total calculated successfully.",
        data: { total },
      };
    } catch (error) {
      console.error(`Error calculating order item total for ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while calculating order item total.",
        error: error,
      };
    }
  }

  /**
   * Calculates the total price for all items within a specific order.
   * @param orderId - The ID of the order to calculate the total for.
   * @returns An OrderItemResponse containing the calculated order total and item count.
   */
  async calculateOrderTotal(orderId: string): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        where: { order: { id: orderId } },
      });

      if (orderItems.length === 0) {
        // It's not necessarily an error if no items are found for an order,
        // but it means the total is 0.
        return {
          success: true, // Changed to true if no items, total is 0
          message: "No order items found for this order. Total is 0.",
          data: { orderId, total: 0, itemCount: 0 },
        };
      }

      const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

      return {
        success: true,
        message: "Order total calculated successfully.",
        data: { orderId, total, itemCount: orderItems.length },
      };
    } catch (error) {
      console.error(`Error calculating order total for order ID ${orderId}:`, error);
      return {
        success: false,
        message: "An error occurred while calculating order total.",
        error: error,
      };
    }
  }
}

export const orderItemService = new OrderItemService();