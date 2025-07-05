import { OrderItem } from "@/db/entities/orderItem";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { Order } from "@/db/entities/order";
import { Product } from "@/db/entities/products";

interface CreateOrderItemData {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface UpdateOrderItemData {
  orderId?: string;
  productId?: string;
  quantity?: number;
  unitPrice?: number;
}

interface OrderItemResponse {
  success: boolean;
  message: string;
  data?: OrderItem | OrderItem[];
  error?: any;
}

export class OrderItemService {
  private orderItemRepo: Repository<OrderItem>;
  private orderRepo: Repository<Order>;
  private productRepo: Repository<Product>;

  constructor() {
    this.orderItemRepo = AppDataSource.getRepository(OrderItem);
    this.orderRepo = AppDataSource.getRepository(Order);
    this.productRepo = AppDataSource.getRepository(Product);
  }

  async createOrderItem(data: CreateOrderItemData): Promise<OrderItemResponse> {
    try {
      const order = await this.orderRepo.findOne({ where: { id: data.orderId } });
      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }

      const product = await this.productRepo.findOne({ where: { id: data.productId } });
      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      if (data.quantity <= 0) {
        return {
          success: false,
          message: "Quantity must be greater than 0",
        };
      }

      if (data.unitPrice < 0) {
        return {
          success: false,
          message: "Unit price cannot be negative",
        };
      }

      const orderItem = this.orderItemRepo.create({
        order: order,
        product: product,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
      });

      await this.orderItemRepo.save(orderItem);

      return {
        success: true,
        message: "Order item created successfully",
        data: orderItem,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while creating the order item",
        error: error
      };
    }
  }

  async getAllOrderItems(): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        relations: ['order', 'product'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Order items retrieved successfully",
        data: orderItems,
      };
    } catch (error) {
      console.error("Error retrieving order items:", error);
      return {
        success: false,
        message: "An error occurred while retrieving order items",
      };
    }
  }

  async getOrderItemById(id: string): Promise<OrderItemResponse> {
    try {
      console.log("order item id is ", id)
      const orderItem = await this.orderItemRepo.findOne({
        where: { id },
        relations: ['order', 'product'],
      });

      if (!orderItem) {
        return {
          success: false,
          message: "Order item not found",
        };
      }

      return {
        success: true,
        message: "Order item retrieved successfully",
        data: orderItem,
      };
    } catch (error) {
      console.error("Error retrieving order item:", error);
      return {
        success: false,
        message: "An error occurred while retrieving the order item",
      };
    }
  }

  async updateOrderItem(id: string, data: UpdateOrderItemData): Promise<OrderItemResponse> {
    try {
      const orderItem = await this.orderItemRepo.findOne({ where: { id } });

      if (!orderItem) {
        return {
          success: false,
          message: "Order item not found",
        };
      }

      if (data.orderId) {
        const order = await this.orderRepo.findOne({ where: { id: data.orderId } });
        if (!order) {
          return {
            success: false,
            message: "Order not found",
          };
        }
        orderItem.order = order;
        delete data.orderId;
      }

      if (data.productId) {
        const product = await this.productRepo.findOne({ where: { id: data.productId } });
        if (!product) {
          return {
            success: false,
            message: "Product not found",
          };
        }
        orderItem.product = product;
        delete data.productId;
      }

      if (data.quantity !== undefined && data.quantity <= 0) {
        return {
          success: false,
          message: "Quantity must be greater than 0",
        };
      }

      if (data.unitPrice !== undefined && data.unitPrice < 0) {
        return {
          success: false,
          message: "Unit price cannot be negative",
        };
      }

      Object.assign(orderItem, data);
      await this.orderItemRepo.save(orderItem);

      return {
        success: true,
        message: "Order item updated successfully",
        data: orderItem,
      };
    } catch (error) {
      console.error("Error updating order item:", error);
      return {
        success: false,
        message: "An error occurred while updating the order item",
      };
    }
  }

  async deleteOrderItem(id: string): Promise<OrderItemResponse> {
    try {
      const orderItem = await this.orderItemRepo.findOne({ where: { id } });

      if (!orderItem) {
        return {
          success: false,
          message: "Order item not found",
        };
      }

      await this.orderItemRepo.remove(orderItem);

      return {
        success: true,
        message: "Order item deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting order item:", error);
      return {
        success: false,
        message: "An error occurred while deleting the order item",
      };
    }
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        where: { order: { id: orderId } },
        relations: ['order', 'product'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Order items retrieved successfully",
        data: orderItems,
      };
    } catch (error) {
      console.error("Error retrieving order items by order:", error);
      return {
        success: false,
        message: "An error occurred while retrieving order items by order",
      };
    }
  }

  async getOrderItemsByProduct(productId: string): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        where: { product: { id: productId } },
        relations: ['order', 'product'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Order items retrieved successfully",
        data: orderItems,
      };
    } catch (error) {
      console.error("Error retrieving order items by product:", error);
      return {
        success: false,
        message: "An error occurred while retrieving order items by product",
      };
    }
  }

  async calculateOrderItemTotal(id: string): Promise<OrderItemResponse> {
    try {
      const orderItem = await this.orderItemRepo.findOne({ where: { id } });

      if (!orderItem) {
        return {
          success: false,
          message: "Order item not found",
        };
      }

      const total = orderItem.quantity * orderItem.unitPrice;

      return {
        success: true,
        message: "Order item total calculated successfully",
        data: { ...orderItem, total } as any,
      };
    } catch (error) {
      console.error("Error calculating order item total:", error);
      return {
        success: false,
        message: "An error occurred while calculating order item total",
      };
    }
  }

  async calculateOrderTotal(orderId: string): Promise<OrderItemResponse> {
    try {
      const orderItems = await this.orderItemRepo.find({
        where: { order: { id: orderId } },
      });

      if (orderItems.length === 0) {
        return {
          success: false,
          message: "No order items found for this order",
        };
      }

      const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

      return {
        success: true,
        message: "Order total calculated successfully",
        data: { orderId, total, itemCount: orderItems.length } as any,
      };
    } catch (error) {
      console.error("Error calculating order total:", error);
      return {
        success: false,
        message: "An error occurred while calculating order total",
      };
    }
  }
}
