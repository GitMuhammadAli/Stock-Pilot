"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Package, 
  Users, 
  Warehouse, 
  ShoppingCart,
  RefreshCw,
  AlertTriangle,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider"; // Import your auth hook

// Import your providers
import { useOrder } from "@/providers/orderProvider";
import { useProduct } from "@/providers/productProvider";
import { useSupplier } from "@/providers/supplierProvider";
import { useWarehouse } from "@/providers/wareHouseProvider";

// Types
interface ReportFilters {
  startDate: string;
  endDate: string;
  entityType: 'all' | 'orders' | 'products' | 'suppliers' | 'warehouses';
  status?: string;
  timeRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  warehouseId?: string;
  supplierId?: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockItems: number;
  activeSuppliers: number;
  warehouseUtilization: number;
  pendingOrders: number;
  completedOrders: number;
  outOfStockItems: number;
  averageOrderValue: number;
}

interface OrderReport {
  period: string;
  orders: number;
  revenue: number;
  averageOrderValue: number;
  status: string;
}

interface ProductReport {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reservedQuantity: number;
  sold: number;
  revenue: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  minStockLevel: number;
}

interface SupplierReport {
  id: string;
  name: string;
  email: string;
  status: string;
  totalOrders: number;
  totalValue: number;
  rating: number;
  paymentTerms?: number;        // Make optional
  currentBalance?: number;      // Make optional
  creditLimit?: number;         // Make optional
  
}

interface WarehouseReport {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  utilizationRate: number;
  status: string;
  availableCapacity: number;
}

export default function ReportsComponent() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Use providers
  const { orders, getAllOrders, loading: ordersLoading } = useOrder();
  const { products, getAllProducts, loading: productsLoading } = useProduct();
  const { suppliers, getAllSuppliers, loading: suppliersLoading } = useSupplier();
  const { warehouses, getAllWarehouses, loading: warehousesLoading } = useWarehouse();

  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    entityType: 'all',
    timeRange: 'month'
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockItems: 0,
    activeSuppliers: 0,
    warehouseUtilization: 0,
    pendingOrders: 0,
    completedOrders: 0,
    outOfStockItems: 0,
    averageOrderValue: 0
  });

  const [orderReports, setOrderReports] = useState<OrderReport[]>([]);
  const [productReports, setProductReports] = useState<ProductReport[]>([]);
  const [supplierReports, setSupplierReports] = useState<SupplierReport[]>([]);
  const [warehouseReports, setWarehouseReports] = useState<WarehouseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check permissions based on user role
  const canViewReports = isAuthenticated && user?.isVerified;
  const canExportData = user?.role === 'admin' || user?.role === 'manager';
  const canViewAnalytics = user?.role === 'admin' || user?.role === 'manager';

  // Load initial data only if authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadAllData();
    }
  }, [isAuthenticated, authLoading]);

  // Refresh data when filters change
  useEffect(() => {
    if (isAuthenticated && !loading && !authLoading) {
      generateReports();
    }
  }, [filters, orders, products, suppliers, warehouses, isAuthenticated, authLoading]);

  const loadAllData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      await Promise.all([
        getAllOrders(),
        getAllProducts(),
        getAllSuppliers(),
        getAllWarehouses()
      ]);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to fetch reports data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!isAuthenticated) return;
    
    setRefreshing(true);
    try {
      await loadAllData();
      toast({
        title: "Data refreshed",
        description: "Reports updated with latest data",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not update reports data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const generateReports = () => {
    if (!isAuthenticated) return;
    
    generateDashboardStats();
    generateOrderReports();
    generateProductReports();
    generateSupplierReports();
    generateWarehouseReports();
  };

  const generateDashboardStats = () => {
    const filteredOrders = filterOrdersByDate(orders);
    const activeProducts = products.filter(p => p.status === 'active');
    const lowStockProducts = products.filter(p => 
      p.quantity <= p.minStockLevel && p.quantity > 0
    );
    const outOfStockProducts = products.filter(p => p.quantity === 0);
    const activeSuppliers = suppliers.filter(s => s.status === 'Active');
    
    const totalRevenue = filteredOrders.reduce((sum, order) => 
      sum + (parseFloat(order.totalAmount?.toString() || '0')), 0
    );
    
    const pendingOrders = filteredOrders.filter(o => 
      ['pending', 'processing', 'confirmed'].includes(o.status)
    ).length;
    
    const completedOrders = filteredOrders.filter(o => 
      ['completed', 'delivered'].includes(o.status)
    ).length;

    const averageOrderValue = filteredOrders.length > 0 ? 
      totalRevenue / filteredOrders.length : 0;

    const totalWarehouseCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const totalOccupancy = warehouses.reduce((sum, w) => sum + w.currentOccupancy, 0);
    const warehouseUtilization = totalWarehouseCapacity > 0 ? 
      (totalOccupancy / totalWarehouseCapacity) * 100 : 0;

    setStats({
      totalOrders: filteredOrders.length,
      totalRevenue,
      totalProducts: activeProducts.length,
      lowStockItems: lowStockProducts.length,
      activeSuppliers: activeSuppliers.length,
      warehouseUtilization,
      pendingOrders,
      completedOrders,
      outOfStockItems: outOfStockProducts.length,
      averageOrderValue
    });
  };

  const generateOrderReports = () => {
    const filteredOrders = filterOrdersByDate(orders);
    
    // Group by month for trend analysis
    const monthlyData: { [key: string]: OrderReport } = {};
    
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const monthKey = orderDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          period: monthKey,
          orders: 0,
          revenue: 0,
          averageOrderValue: 0,
          status: order.status
        };
      }
      
      const orderAmount = parseFloat(order.totalAmount?.toString() || '0');
      monthlyData[monthKey].orders += 1;
      monthlyData[monthKey].revenue += orderAmount;
    });
    
    // Calculate averages
    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].averageOrderValue = monthlyData[month].revenue / monthlyData[month].orders;
    });
    
    setOrderReports(Object.values(monthlyData));
  };

  const generateProductReports = () => {
    const productReportsData: ProductReport[] = products.map(product => {
      const availableQuantity = product.quantity - (product.reservedQuantity || 0);
      let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
      
      if (availableQuantity === 0) {
        stockStatus = 'out_of_stock';
      } else if (availableQuantity <= (product.minStockLevel || 0)) {
        stockStatus = 'low_stock';
      }
      
      // Calculate sales (this would need actual sales data from orders)
      const sold = Math.max(0, product.totalSold || 0);
      const revenue = Math.max(0, product.totalRevenue || 0);
      
      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category || 'Uncategorized',
        quantity: product.quantity,
        reservedQuantity: product.reservedQuantity || 0,
        sold,
        revenue,
        stockStatus,
        minStockLevel: product.minStockLevel || 0
      };
    });
    
    setProductReports(productReportsData);
  };

const generateSupplierReports = () => {
  const supplierReportsData: SupplierReport[] = suppliers.map(supplier => {
    const supplierOrders = orders.filter(order => order.supplierId === supplier.id);
    const totalValue = supplierOrders.reduce((sum, order) => 
      sum + parseFloat(order.totalAmount?.toString() || '0'), 0
    );
    
    // Safely parse paymentTerms to number
    let paymentTerms = 30; // default
    if (supplier.paymentTerms !== undefined && supplier.paymentTerms !== null) {
      if (typeof supplier.paymentTerms === 'number') {
        paymentTerms = supplier.paymentTerms;
      } else if (typeof supplier.paymentTerms === 'string') {
        paymentTerms = parseInt(supplier.paymentTerms, 10) || 30;
      } else {
        // For other types (bigint, boolean, React elements, etc.), use default
        paymentTerms = 30;
      }
    }
    
    return {
      id: supplier.id || '',
      name: supplier.name || 'Unknown Supplier',
      email: supplier.email || '',
      status: supplier.status || 'inactive',
      totalOrders: supplierOrders.length,
      totalValue,
      rating: parseFloat(supplier.rating?.toString() || '0'),
      paymentTerms: paymentTerms,
      currentBalance: parseFloat(supplier.currentBalance?.toString() || '0'),
      creditLimit: parseFloat(supplier.creditLimit?.toString() || '10000')
    };
  });
  
  setSupplierReports(supplierReportsData);
};

  const generateWarehouseReports = () => {
    const warehouseReportsData: WarehouseReport[] = warehouses.map(warehouse => {
      const utilizationRate = warehouse.capacity > 0 ? 
        (warehouse.currentOccupancy / warehouse.capacity) * 100 : 0;
      
      return {
        id: warehouse.id,
        name: warehouse.name,
        location: warehouse.location,
        capacity: warehouse.capacity,
        currentOccupancy: warehouse.currentOccupancy,
        utilizationRate,
        status: warehouse.status,
        availableCapacity: warehouse.capacity - warehouse.currentOccupancy
      };
    });
    
    setWarehouseReports(warehouseReportsData);
  };

  const filterOrdersByDate = (orders: any[]) => {
    const { startDate, endDate } = getDateRange();
    return orders.filter(order => {
      if (!order.orderDate) return false;
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filters.timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case 'custom':
        startDate = new Date(filters.startDate);
        endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    return { startDate, endDate };
  };

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async (type: string) => {
    if (!canExportData) {
      toast({
        title: "Access denied",
        description: "You don't have permission to export data",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = getExportData(type);
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${type} report downloaded`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export report",
        variant: "destructive",
      });
    }
  };

  const getExportData = (type: string) => {
    switch (type) {
      case 'orders': return orderReports;
      case 'products': return productReports;
      case 'suppliers': return supplierReports;
      case 'warehouses': return warehouseReports;
      case 'all': return {
        stats,
        orders: orderReports,
        products: productReports,
        suppliers: supplierReports,
        warehouses: warehouseReports,
        generatedAt: new Date().toISOString(),
        generatedBy: user?.email
      };
      default: return {};
    }
  };

  const getStockStatusBadge = (status: string) => {
    const variants = {
      in_stock: "bg-green-100 text-green-800",
      low_stock: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800"
    };
    return <Badge className={variants[status as keyof typeof variants]}>
      {status.replace('_', ' ')}
    </Badge>;
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return "text-red-600 font-semibold";
    if (rate >= 75) return "text-yellow-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'active' ? 'default' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
        <span>Loading reports...</span>
      </div>
    );
  }

  // Show unauthorized state
  if (!canViewReports) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Lock className="h-16 w-16 text-gray-400" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            {!isAuthenticated 
              ? "Please log in to view reports" 
              : "Your account needs to be verified to access reports"
            }
          </p>
        </div>
        {!isAuthenticated && (
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-white">
            Real-time insights for {user?.name || user?.email}
            {user?.role && <Badge variant="outline" className="ml-2">{user.role}</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          {canExportData && (
            <Button variant="outline" onClick={() => handleExport('all')}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label >Time Range</Label>
              <Select  value={filters.timeRange}  onValueChange={(value) => handleFilterChange('timeRange', value)}>
                <SelectTrigger className="bg-[#2C3444] border border-gray-600 text-gray-100" >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent  >
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filters.timeRange === 'custom' && (
              <>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div>
              <Label>Entity Type</Label>
              <Select value={filters.entityType} onValueChange={(value) => handleFilterChange('entityType', value)}>
                <SelectTrigger className="bg-[#2C3444] border border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="suppliers">Suppliers</SelectItem>
                  <SelectItem value="warehouses">Warehouses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600">
                  {stats.pendingOrders} pending, {stats.completedOrders} completed
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Avg: ${stats.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Health</p>
                <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                <p className="text-sm text-gray-600">
                  {stats.outOfStockItems} out of stock
                </p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warehouse Utilization</p>
                <p className="text-2xl font-bold">{stats.warehouseUtilization.toFixed(1)}%</p>
                <p className={`text-sm ${
                  stats.warehouseUtilization >= 90 ? 'text-red-600' : 
                  stats.warehouseUtilization >= 75 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {stats.warehouseUtilization >= 90 ? 'Critical' : 
                   stats.warehouseUtilization >= 75 ? 'High' : 'Optimal'}
                </p>
              </div>
              <Warehouse className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(stats.lowStockItems > 0 || stats.outOfStockItems > 0 || stats.warehouseUtilization >= 90) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Attention Required</span>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              {stats.lowStockItems > 0 && <p>• {stats.lowStockItems} items are low on stock</p>}
              {stats.outOfStockItems > 0 && <p>• {stats.outOfStockItems} items are out of stock</p>}
              {stats.warehouseUtilization >= 90 && <p>• Warehouse utilization is critical ({stats.warehouseUtilization.toFixed(1)}%)</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          {canViewAnalytics && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        {/* Orders Report */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Performance</CardTitle>
              {canExportData && (
                <Button variant="outline" size="sm" onClick={() => handleExport('orders')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {orderReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No order data available for the selected period
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Period</th>
                        <th className="text-left p-3">Orders</th>
                        <th className="text-left p-3">Revenue</th>
                        <th className="text-left p-3">Avg Order Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderReports.map((report, index) => (
                        <tr key={index} className="border-b hover:bg-background">
                          <td className="p-3">{report.period}</td>
                          <td className="p-3">{report.orders}</td>
                          <td className="p-3">${report.revenue.toLocaleString()}</td>
                          <td className="p-3">${report.averageOrderValue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Report */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Inventory & Sales</CardTitle>
              {canExportData && (
                <Button variant="outline" size="sm" onClick={() => handleExport('products')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">SKU</th>
                      <th className="text-left p-3">Product Name</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Stock</th>
                      <th className="text-left p-3">Reserved</th>
                      <th className="text-left p-3">Available</th>
                      <th className="text-left p-3">Sold</th>
                      <th className="text-left p-3">Revenue</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productReports.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-background">
                        <td className="p-3 font-mono text-sm">{product.sku}</td>
                        <td className="p-3">{product.name}</td>
                        <td className="p-3">{product.category}</td>
                        <td className="p-3">{product.quantity}</td>
                        <td className="p-3">{product.reservedQuantity}</td>
                        <td className="p-3">{product.quantity - product.reservedQuantity}</td>
                        <td className="p-3">{product.sold}</td>
                        <td className="p-3">${product.revenue.toLocaleString()}</td>
                        <td className="p-3">{getStockStatusBadge(product.stockStatus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Report */}
        <TabsContent value="suppliers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Supplier Performance</CardTitle>
              {canExportData && (
                <Button variant="outline" size="sm" onClick={() => handleExport('suppliers')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Supplier Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Total Orders</th>
                      <th className="text-left p-3">Total Value</th>
                      <th className="text-left p-3">Rating</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Payment Terms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierReports.map((supplier) => (
                      <tr key={supplier.id} className="border-b hover:bg-background">
                        <td className="p-3">{supplier.name}</td>
                        <td className="p-3">{supplier.email}</td>
                        <td className="p-3">{supplier.totalOrders}</td>
                        <td className="p-3">${supplier.totalValue.toLocaleString()}</td>
                        <td className="p-3">{supplier.rating}/5</td>
                        <td className="p-3">{getStatusBadge(supplier.status)}</td>
                        <td className="p-3">{supplier.paymentTerms} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouses Report */}
        <TabsContent value="warehouses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Warehouse Capacity & Utilization</CardTitle>
              {canExportData && (
                <Button variant="outline" size="sm" onClick={() => handleExport('warehouses')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Warehouse</th>
                      <th className="text-left p-3">Location</th>
                      <th className="text-left p-3">Capacity</th>
                      <th className="text-left p-3">Occupied</th>
                      <th className="text-left p-3">Available</th>
                      <th className="text-left p-3">Utilization</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouseReports.map((warehouse) => (
                      <tr key={warehouse.id} className="border-b hover:bg-background">
                        <td className="p-3 font-medium">{warehouse.name}</td>
                        <td className="p-3">{warehouse.location}</td>
                        <td className="p-3">{warehouse.capacity.toLocaleString()}</td>
                        <td className="p-3">{warehouse.currentOccupancy.toLocaleString()}</td>
                        <td className="p-3">{warehouse.availableCapacity.toLocaleString()}</td>
                        <td className={`p-3 ${getUtilizationColor(warehouse.utilizationRate)}`}>
                          {warehouse.utilizationRate.toFixed(1)}%
                        </td>
                        <td className="p-3">{getStatusBadge(warehouse.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics - Only for managers and admins */}
        {canViewAnalytics && (
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Order Fulfillment Rate</span>
                    <span className="font-semibold">
                      {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory Turnover</span>
                    <span className="font-semibold">
                      {stats.totalProducts > 0 ? (stats.totalRevenue / stats.totalProducts).toFixed(1) : 0}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier Performance</span>
                    <span className="font-semibold">
                      {supplierReports.length > 0 ? 
                        (supplierReports.reduce((sum, s) => sum + s.rating, 0) / supplierReports.length).toFixed(1) : 0}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock Coverage</span>
                    <span className="font-semibold">
                      {((stats.totalProducts - stats.outOfStockItems) / stats.totalProducts * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/products?filter=low_stock">
                      <Package className="h-4 w-4 mr-2" />
                      Reorder Low Stock Items ({stats.lowStockItems})
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/suppliers">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Suppliers ({stats.activeSuppliers})
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/warehouses">
                      <Warehouse className="h-4 w-4 mr-2" />
                      Optimize Warehouse Space
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/orders">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Review Pending Orders ({stats.pendingOrders})
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Order Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {orderReports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No trend data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderReports.slice(-6).map((report, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{report.period}</span>
                          <div className="flex items-center gap-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, (report.orders / Math.max(...orderReports.map(r => r.orders))) * 100)}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12">{report.orders} orders</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Health Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Stock</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${stats.totalProducts > 0 ? ((stats.totalProducts - stats.lowStockItems - stats.outOfStockItems) / stats.totalProducts * 100) : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">
                          {stats.totalProducts - stats.lowStockItems - stats.outOfStockItems}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Stock</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full" 
                            style={{ 
                              width: `${stats.totalProducts > 0 ? (stats.lowStockItems / stats.totalProducts * 100) : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{stats.lowStockItems}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Out of Stock</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ 
                              width: `${stats.totalProducts > 0 ? (stats.outOfStockItems / stats.totalProducts * 100) : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{stats.outOfStockItems}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Data Last Updated */}
      <div className="text-center text-sm text-gray-500">
        <p>Data last updated: {new Date().toLocaleString()}</p>
        {user?.role && (
          <p className="mt-1">
            Viewing as: <Badge variant="outline">{user.role}</Badge>
            {!canExportData && " (Limited permissions)"}
          </p>
        )}
      </div>
    </div>
  );
}