import { Order, OrderStatus } from "@/db/entities/order";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";
import { Supplier } from "@/db/entities/supplier";
import { WareHouse } from "@/db/entities/wareHouse";

interface CreateOrderData {
  orderNumber: string;
  status?: OrderStatus;
  supplierId: string;
  warehouseId: string;
  createdById: string;
}

interface UpdateOrderData {
  orderNumber?: string;
  status?: OrderStatus;
  supplierId?: string;
  warehouseId?: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data?: Order | Order[];
  error?: any;
}

export class OrderService {
  private orderRepo: Repository<Order>;
  private userRepo: Repository<User>;
  private supplierRepo: Repository<Supplier>;
  private warehouseRepo: Repository<WareHouse>;

  constructor() {
    this.orderRepo = AppDataSource.getRepository(Order);
    this.userRepo = AppDataSource.getRepository(User);
    this.supplierRepo = AppDataSource.getRepository(Supplier);
    this.warehouseRepo = AppDataSource.getRepository(WareHouse);
  }

  async createOrder(data: CreateOrderData): Promise<OrderResponse> {
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

      const warehouse = await this.warehouseRepo.findOne({ where: { id: data.warehouseId } });
      if (!warehouse) {
        return {
          success: false,
          message: "Warehouse not found",
        };
      }

      const order = this.orderRepo.create({
        orderNumber: data.orderNumber,
        status: data.status || OrderStatus.PENDING,
        supplier: supplier,
        supplierId: data.supplierId,
        warehouse: warehouse,
        warehouseId: data.warehouseId,
        createdBy: user,
        createdById: data.createdById,
      });

      await this.orderRepo.save(order);

      return {
        success: true,
        message: "Order created successfully",
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while creating the order",
        error: error
      };
    }
  }

  async getAllOrders(): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      };
    } catch (error) {
      console.error("Error retrieving orders:", error);
      return {
        success: false,
        message: "An error occurred while retrieving orders",
      };
    }
  }

  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      console.log("order id is ", id)
      const order = await this.orderRepo.findOne({
        where: { id },
        relations: ['createdBy', 'supplier', 'warehouse'],
      });

      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }

      return {
        success: true,
        message: "Order retrieved successfully",
        data: order,
      };
    } catch (error) {
      console.error("Error retrieving order:", error);
      return {
        success: false,
        message: "An error occurred while retrieving the order",
      };
    }
  }

  async updateOrder(id: string, data: UpdateOrderData): Promise<OrderResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } });

      if (!order) {
        return {
          success: false,
          message: "Order not found",
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
        order.supplier = supplier;
        order.supplierId = data.supplierId;
        delete data.supplierId;
      }

      if (data.warehouseId) {
        const warehouse = await this.warehouseRepo.findOne({ where: { id: data.warehouseId } });
        if (!warehouse) {
          return {
            success: false,
            message: "Warehouse not found",
          };
        }
        order.warehouse = warehouse;
        order.warehouseId = data.warehouseId;
        delete data.warehouseId;
      }

      Object.assign(order, data);
      await this.orderRepo.save(order);

      return {
        success: true,
        message: "Order updated successfully",
        data: order,
      };
    } catch (error) {
      console.error("Error updating order:", error);
      return {
        success: false,
        message: "An error occurred while updating the order",
      };
    }
  }

  async deleteOrder(id: string): Promise<OrderResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } });

      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }

      await this.orderRepo.remove(order);

      return {
        success: true,
        message: "Order deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting order:", error);
      return {
        success: false,
        message: "An error occurred while deleting the order",
      };
    }
  }

  async getOrdersByUser(userId: string): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { createdBy: { id: userId } },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      };
    } catch (error) {
      console.error("Error retrieving user orders:", error);
      return {
        success: false,
        message: "An error occurred while retrieving user orders",
      };
    }
  }

  async getOrdersBySupplier(supplierId: string): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { supplier: { id: supplierId } },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      };
    } catch (error) {
      console.error("Error retrieving supplier orders:", error);
      return {
        success: false,
        message: "An error occurred while retrieving supplier orders",
      };
    }
  }

  async getOrdersByWarehouse(warehouseId: string): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { warehouse: { id: warehouseId } },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      };
    } catch (error) {
      console.error("Error retrieving warehouse orders:", error);
      return {
        success: false,
        message: "An error occurred while retrieving warehouse orders",
      };
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id } });

      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }

      order.status = status;
      await this.orderRepo.save(order);

      return {
        success: true,
        message: "Order status updated successfully",
        data: order,
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      return {
        success: false,
        message: "An error occurred while updating order status",
      };
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderResponse> {
    try {
      const orders = await this.orderRepo.find({
        where: { status },
        relations: ['createdBy', 'supplier', 'warehouse'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      };
    } catch (error) {
      console.error("Error retrieving orders by status:", error);
      return {
        success: false,
        message: "An error occurred while retrieving orders by status",
      };
    }
  }
}
