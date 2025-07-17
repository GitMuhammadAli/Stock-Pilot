import { Order, OrderStatus } from "@/db/entities/order";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";
import { Supplier } from "@/db/entities/supplier";
import { WareHouse } from "@/db/entities/wareHouse";

// Interface for creating a new order
interface CreateOrderData {
  orderNumber: string;
  status?: OrderStatus; 
  supplierId: string;
  warehouseId: string;
  createdById: string;
}

// Interface for updating an existing order
interface UpdateOrderData {
  orderNumber?: string;
  status?: OrderStatus;
  supplierId?: string; 
  warehouseId?: string;
}

// Standardized response interface for service methods
interface OrderResponse {
  success: boolean;
  message: string;
  data?: Order | Order[] | null; // Added null for cases where data might not be found
  error?: any; // Keeping 'any' for general error catching as requested
}

export class OrderService {
  private orderRepo: Repository<Order>;
  private userRepo: Repository<User>;
  private supplierRepo: Repository<Supplier>;
  private warehouseRepo: Repository<WareHouse>;

  constructor() {
    // Ensure AppDataSource is initialized before getting repositories
    if (!AppDataSource.isInitialized) {
      console.warn("AppDataSource is not initialized. Ensure connectDB() is called before using OrderService.");
      // In a real application, you might want to throw an error here or handle this more robustly.
    }
    this.orderRepo = AppDataSource.getRepository(Order);
    this.userRepo = AppDataSource.getRepository(User);
    this.supplierRepo = AppDataSource.getRepository(Supplier);
    this.warehouseRepo = AppDataSource.getRepository(WareHouse);
  }

  /**
   * Creates a new order entry in the database.
   * @param data - The data for the new order, including related entity IDs.
   * @returns An OrderResponse indicating success or failure, with the created order data.
   */
  async createOrder(data: CreateOrderData): Promise<OrderResponse> {
    try {
      // Validate and fetch related entities
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: `User with ID ${data.createdById} not found.`,
        };
      }

      const supplier = await this.supplierRepo.findOne({ where: { id: data.supplierId } });
      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${data.supplierId} not found.`,
        };
      }

      const warehouse = await this.warehouseRepo.findOne({ where: { id: data.warehouseId } });
      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${data.warehouseId} not found.`,
        };
      }

      // Create a new order instance
      const order = this.orderRepo.create({
        orderNumber: data.orderNumber,
        status: data.status || OrderStatus.PENDING, // Use provided status or default
        supplier: supplier,
        supplierId: data.supplierId, // Explicitly set foreign key
        warehouse: warehouse,
        warehouseId: data.warehouseId, // Explicitly set foreign key
        createdBy: user,
        createdById: data.createdById, // Explicitly set foreign key
      });

      // Save the new order to the database
      await this.orderRepo.save(order);

      return {
        success: true,
        message: "Order created successfully.",
        data: order,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        success: false,
        message: "An error occurred while creating the order.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all orders from the database.
   * @returns An OrderResponse containing a list of all orders.
   */
  async getAllOrders(): Promise<OrderResponse> {
    try {
      // Find all orders and eager load related entities
      const orders = await this.orderRepo.find({
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Orders retrieved successfully.",
        data: orders,
      };
    } catch (error) {
      console.error("Error retrieving all orders:", error);
      return {
        success: false,
        message: "An error occurred while retrieving orders.",
        error: error,
      };
    }
  }

  /**
   * Retrieves a single order by its ID.
   * @param id - The ID of the order to retrieve.
   * @returns An OrderResponse containing the found order data, or a not found message.
   */
  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      console.log(`Attempting to retrieve order with ID: ${id}`);
      // Find one order by ID and eager load related entities
      const order = await this.orderRepo.findOne({
        where: { id },
        relations: ['createdBy', 'supplier', 'warehouse'],
      });

      if (!order) {
        return {
          success: false,
          message: `Order with ID ${id} not found.`,
          data: null, // Explicitly set data to null when not found
        };
      }

      return {
        success: true,
        message: "Order retrieved successfully.",
        data: order,
      };
    } catch (error) {
      console.error(`Error retrieving order with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving the order.",
        error: error,
      };
    }
  }

  /**
   * Updates an existing order by its ID.
   * @param id - The ID of the order to update.
   * @param data - The partial data to update the order with.
   * @returns An OrderResponse indicating success or failure, with the updated order data.
   */
  async updateOrder(id: string, data: UpdateOrderData): Promise<OrderResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } });

      if (!order) {
        return {
          success: false,
          message: `Order with ID ${id} not found.`,
        };
      }

      // Handle updates to related entities (supplier and warehouse)
      if (data.supplierId) {
        const supplier = await this.supplierRepo.findOne({ where: { id: data.supplierId } });
        if (!supplier) {
          return {
            success: false,
            message: `Supplier with ID ${data.supplierId} not found.`,
          };
        }
        order.supplier = supplier;
        order.supplierId = data.supplierId;
      }

      if (data.warehouseId) {
        const warehouse = await this.warehouseRepo.findOne({ where: { id: data.warehouseId } });
        if (!warehouse) {
          return {
            success: false,
            message: `Warehouse with ID ${data.warehouseId} not found.`,
          };
        }
        order.warehouse = warehouse;
        order.warehouseId = data.warehouseId;
      }

      // Apply other partial updates to the found order entity
      // Destructure to exclude relation IDs from direct Object.assign
      const { supplierId, warehouseId, ...restData } = data;
      Object.assign(order, restData);

      await this.orderRepo.save(order);

      return {
        success: true,
        message: "Order updated successfully.",
        data: order,
      };
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating the order.",
        error: error,
      };
    }
  }

  /**
   * Deletes an order by its ID.
   * @param id - The ID of the order to delete.
   * @returns An OrderResponse indicating success or failure.
   */
  async deleteOrder(id: string): Promise<OrderResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } });

      if (!order) {
        return {
          success: false,
          message: `Order with ID ${id} not found.`,
        };
      }

      await this.orderRepo.remove(order);

      return {
        success: true,
        message: "Order deleted successfully.",
      };
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while deleting the order.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all orders created by a specific user.
   * @param userId - The ID of the user whose orders are to be retrieved.
   * @returns An OrderResponse containing a list of orders created by the user.
   */
  async getOrdersByUser(userId: string): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { createdBy: { id: userId } },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Orders for user ID ${userId} retrieved successfully.`,
        data: orders,
      };
    } catch (error) {
      console.error(`Error retrieving orders for user ID ${userId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving user orders.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all orders associated with a specific supplier.
   * @param supplierId - The ID of the supplier whose orders are to be retrieved.
   * @returns An OrderResponse containing a list of orders from the supplier.
   */
  async getOrdersBySupplier(supplierId: string): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { supplier: { id: supplierId } },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Orders for supplier ID ${supplierId} retrieved successfully.`,
        data: orders,
      };
    } catch (error) {
      console.error(`Error retrieving orders for supplier ID ${supplierId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving supplier orders.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all orders located in a specific warehouse.
   * @param warehouseId - The ID of the warehouse whose orders are to be retrieved.
   * @returns An OrderResponse containing a list of orders in the warehouse.
   */
  async getOrdersByWarehouse(warehouseId: string): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { warehouse: { id: warehouseId } },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Orders in warehouse ID ${warehouseId} retrieved successfully.`,
        data: orders,
      };
    } catch (error) {
      console.error(`Error retrieving orders for warehouse ID ${warehouseId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving warehouse orders.",
        error: error,
      };
    }
  }

  /**
   * Updates the status of a specific order.
   * @param id - The ID of the order to update.
   * @param status - The new order status.
   * @returns An OrderResponse indicating success or failure, with the updated order data.
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } });

      if (!order) {
        return {
          success: false,
          message: `Order with ID ${id} not found.`,
        };
      }

      order.status = status;
      await this.orderRepo.save(order);

      return {
        success: true,
        message: "Order status updated successfully.",
        data: order,
      };
    } catch (error) {
      console.error(`Error updating order status for ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating order status.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all orders with a specific status.
   * @param status - The status to filter orders by.
   * @returns An OrderResponse containing a list of orders with the specified status.
   */
  async getOrdersByStatus(status: OrderStatus): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { status },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Orders with status '${status}' retrieved successfully.`,
        data: orders,
      };
    } catch (error) {
      console.error(`Error retrieving orders by status '${status}':`, error);
      return {
        success: false,
        message: "An error occurred while retrieving orders by status.",
        error: error,
      };
    }
  }
}

export const orderService = new OrderService();