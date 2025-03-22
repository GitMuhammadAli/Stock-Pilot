"use client"

import React, { useState } from 'react'
import { LayoutDashboard, Warehouse, Package, BarChart2, FileText, Settings, Users, Menu, X, Bell, Search, ChevronDown, LogOut, CreditCard, HelpCircle, User, Shield, Zap, Clock, AlertTriangle, DollarSign, TrendingUp, Filter, Download, QrCode, Repeat, Plus, Calendar, CheckCircle, RefreshCw, MoreHorizontal, ChevronRight, Star, Layers, Truck, Clipboard, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const CompleteDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Toggle sidebar on mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  // Toggle sidebar on desktop
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <div className="flex h-screen bg-[#0B0F1A] text-white overflow-hidden">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {/* Sidebar */}
      <aside
        className={`bg-[#1C2333] w-64 min-h-screen flex-shrink-0 flex flex-col z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:w-64' : 'md:w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <div className={`flex items-center p-4 h-16 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen ? (
            <h1 className="text-2xl font-bold text-[#B6F400]">StockPilot</h1>
          ) : (
            <div className="w-10 h-10 bg-[#B6F400] rounded-md flex items-center justify-center">
              <span className="text-[#0B0F1A] font-bold text-xl">S</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            <ChevronRight className={`h-5 w-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            {sidebarOpen && <p className="text-xs font-semibold text-gray-400 mb-2">MAIN</p>}
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} bg-[#2C3444]`}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Dashboard</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Warehouse className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Warehouses</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Products</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Layers className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Inventory</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Truck className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Suppliers</span>}
                </Button>
              </li>
            </ul>
          </div>
          
          <div className="px-4 mb-2">
            {sidebarOpen && <p className="text-xs font-semibold text-gray-400 mb-2 mt-6">ANALYTICS</p>}
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Reports</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <PieChart className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Analytics</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Documents</span>}
                </Button>
              </li>
            </ul>
          </div>
          
          <div className="px-4">
            {sidebarOpen && <p className="text-xs font-semibold text-gray-400 mb-2 mt-6">ADMIN</p>}
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Users</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Settings</span>}
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Subscription</span>}
                </Button>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* Subscription Status */}
        {sidebarOpen && (
          <div className="p-4 mt-auto">
            <Card className="bg-[#2C3444] border-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-[#B6F400] text-[#0B0F1A]">Pro Plan</Badge>
                  <span className="text-xs text-gray-400">25 days left</span>
                </div>
                <Progress value={65} className="h-1 mb-2" />
                <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* User Profile */}
        <div className={`p-4 border-t border-[#2C3444] ${sidebarOpen ? '' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#1C2333] h-16 flex items-center px-4 border-b border-[#2C3444]">
          <div className="flex-1 flex items-center">
            <div className="relative max-w-md w-full mr-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-8 bg-[#2C3444] border-none text-white w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <QrCode className="h-4 w-4 mr-2" />
              Scan
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-[#B6F400] rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {[
                    { title: "Low stock alert", desc: "Widget A is running low on stock", time: "5 min ago", icon: AlertTriangle, color: "text-yellow-500" },
                    { title: "Order completed", desc: "Order #12345 has been fulfilled", time: "1 hour ago", icon: CheckCircle, color: "text-green-500" },
                    { title: "New shipment", desc: "New shipment arrived at Main Warehouse", time: "3 hours ago", icon: Truck, color: "text-blue-500" },
                    { title: "System update", desc: "StockPilot will be updated tonight", time: "5 hours ago", icon: RefreshCw, color: "text-purple-500" },
                  ].map((notification, i) => (
                    <div key={i} className="flex p-3 hover:bg-[#2C3444] cursor-pointer">
                      <div className={`mr-3 mt-1 ${notification.color}`}>
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-400">{notification.desc}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Community</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>What's New</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-[#0B0F1A] p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back, John! Here's what's happening today.</p>
              </div>
              <div className="flex mt-4 md:mt-0 space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Today
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Subscription Alert */}
            <Card className="bg-[#2C3444] border-none mb-8">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-start md:items-center">
                  <div className="bg-[#B6F400]/20 p-2 rounded-full mr-4">
                    <Star className="h-6 w-6 text-[#B6F400]" />
                  </div>
                  <div>
                    <h3 className="font-medium">You're on the Pro Plan</h3>
                    <p className="text-sm text-gray-400">Your subscription renews on Sep 22, 2023</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button variant="outline" size="sm">View Plan</Button>
                  <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]" size="sm">Upgrade</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#1C2333] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#B6F400]">Total Products</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#B6F400]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-500">12% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1C2333] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#B6F400]">Low Stock Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#FF5A5F]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24 items</div>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-500">5 more than last week</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1C2333] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#B6F400]">Expiring Soon</CardTitle>
                  <Clock className="h-4 w-4 text-[#FF5A5F]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">37 items</div>
                  <p className="text-xs text-muted-foreground">Within next 7 days</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1C2333] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#B6F400]">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-[#B6F400]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$123.4K</div>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-500">8% from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-[#1C2333] border-none shadow-lg col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#B6F400]">Usage Stats</CardTitle>
                  <CardDescription className="text-gray-400">Your plan limits and usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Products</span>
                      <span className="text-sm">1,234 / 2,000</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Warehouses</span>
                      <span className="text-sm">4 / 10</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Users</span>
                      <span className="text-sm">8 / 15</span>
                    </div>
                    <Progress value={53} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">API Calls</span>
                      <span className="text-sm">45K / 100K</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-[#1C2333] border-none shadow-lg col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#B6F400]">Warehouse Capacity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4">
                    <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
                      {/* Heatmap cells with different opacities to simulate data */}
                      {[0.9, 0.7, 0.5, 0.3, 0.6, 0.8, 0.4, 0.2, 0.3, 0.5, 0.9, 0.7, 0.2, 0.4, 0.6, 0.8].map((opacity, index) => (
                        <div 
                          key={index} 
                          className="rounded-md flex items-center justify-center text-xs font-medium"
                          style={{ backgroundColor: `rgba(182, 244, 0, ${opacity})`, color: opacity > 0.6 ? '#0B0F1A' : 'white' }}
                        >
                          {Math.round(opacity * 100)}%
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-400">
                    <div>Main Warehouse</div>
                    <div>West Coast Hub</div>
                    <div>Central Distribution</div>
                    <div>East Coast Center</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs Section */}
            <Tabs defaultValue="inventory" className="mb-8">
              <TabsList className="bg-[#1C2333] border-b border-[#2C3444] w-full justify-start rounded-none p-0">
                <TabsTrigger value="inventory" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#B6F400] data-[state=active]:shadow-none">
                  Inventory Overview
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#B6F400] data-[state=active]:shadow-none">
                  Recent Activity
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#B6F400] data-[state=active]:shadow-none">
                  Pending Orders
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="mt-4">
                <Card className="bg-[#1C2333] border-none shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-[#B6F400]">Inventory Status</CardTitle>
                      <Button variant="outline" size="sm">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#2C3444]">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Product</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">SKU</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Warehouse</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Quantity</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "Widget A", sku: "WA-001", warehouse: "Main Warehouse", qty: 150, status: "In Stock" },
                            { name: "Gadget B", sku: "GB-002", warehouse: "West Coast Hub", qty: 23, status: "Low Stock" },
                            { name: "Tool C", sku: "TC-003", warehouse: "Central Distribution", qty: 0, status: "Out of Stock" },
                            { name: "Component D", sku: "CD-004", warehouse: "East Coast Center", qty: 75, status: "In Stock" },
                            { name: "Product E", sku: "PE-005", warehouse: "Main Warehouse", qty: 12, status: "Low Stock" },
                          ].map((item, i) => (
                            <tr key={i} className="border-b border-[#2C3444] last:border-0">
                              <td className="py-3 px-4">{item.name}</td>
                              <td className="py-3 px-4 text-gray-400">{item.sku}</td>
                              <td className="py-3 px-4">{item.warehouse}</td>
                              <td className="py-3 px-4">{item.qty}</td>
                              <td className="py-3 px-4">
                                <Badge className={
                                  item.status === "In Stock" ? "bg-green-500" : 
                                  item.status === "Low Stock" ? "bg-yellow-500" : 
                                  "bg-red-500"
                                }>
                                  {item.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4">
                <Card className="bg-[#1C2333] border-none shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-[#B6F400]">Recent Activity</CardTitle>
                      <Button variant="outline" size="sm">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "Product restocked", item: "Widget A", quantity: "+100", date: "Today, 10:30 AM", user: "John Doe" },
                        { action: "New order placed", item: "Gadget B", quantity: "-50", date: "Yesterday, 3:15 PM", user: "Sarah Johnson" },
                        { action: "Inventory adjusted", item: "Tool C", quantity: "-5", date: "Yesterday, 11:20 AM", user: "Mike Chen" },
                        { action: "Item transferred", item: "Component D", quantity: "±25", date: "Aug 15, 2:45 PM", user: "Emily Wilson" },
                        { action: "New product added", item: "Product E", quantity: "+200", date: "Aug 14, 9:30 AM", user: "John Doe" },
                      ].map((activity, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-[#2C3444] pb-3 last:border-0">
                          <div className="flex items-start">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{activity.action}</div>
                              <div className="text-sm text-gray-400">{activity.item} by {activity.user}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${
                              activity.quantity.startsWith('+') ? 'text-green-400' : 
                              activity.quantity.startsWith('-') ? 'text-red-400' : 'text-blue-400'
                            }`}>
                              {activity.quantity}
                            </div>
                            <div className="text-sm text-gray-400">{activity.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders" className="mt-4">
                <Card className="bg-[#1C2333] border-none shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-[#B6F400]">Pending Orders</CardTitle>
                      <Button variant="outline" size="sm">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#2C3444]">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order ID</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Items</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Total</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: "ORD-001", customer: "Acme Inc", items: 5, total: "$1,250.00", status: "Processing" },
                            { id: "ORD-002", customer: "TechCorp", items: 2, total: "$450.00", status: "Pending" },
                            { id: "ORD-003", customer: "Global Supplies", items: 8, total: "$3,200.00", status: "Processing" },
                            { id: "ORD-004", customer: "Local Shop", items: 1, total: "$120.00", status: "Pending" },
                            { id: "ORD-005", customer: "MegaStore", items: 12, total: "$5,400.00", status: "Processing" },
                          ].map((order, i) => (
                            <tr key={i} className="border-b border-[#2C3444] last:border-0">
                              <td className="py-3 px-4">{order.id}</td>
                              <td className="py-3 px-4">{order.customer}</td>
                              <td className="py-3 px-4">{order.items}</td>
                              <td className="py-3 px-4">{order.total}</td>
                              <td className="py-3 px-4">
                                <Badge className={
                                  order.status === "Processing" ? "bg-blue-500" : 
                                  "bg-yellow-500"
                                }>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Stock Movement and Cost Saving */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-[#1C2333] border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#B6F400]">Stock Movement Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-[#2C3444] rounded-lg p-4 relative">
                    {/* Chart grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                      <div className="w-full h-px bg-gray-700"></div>
                      <div className="w-full h-px bg-gray-700"></div>
                      <div className="w-full h-px bg-gray-700"></div>
                      <div className="w-full h-px bg-gray-700"></div>
                    </div>
                    
                    {/* Simulated chart line */}
                    <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                      <path 
                        d="M0,150 L40,120 L80,160 L120,100 L160,70 L200,90 L240,40 L300,60" 
                        fill="none" 
                        stroke="#B6F400" 
                        strokeWidth="3"
                      />
                      {/* Data points */}
                      <circle cx="0" cy="150" r="4" fill="#B6F400" />
                      <circle cx="40" cy="120" r="4" fill="#B6F400" />
                      <circle cx="80" cy="160" r="4" fill="#B6F400" />
                      <circle cx="120" cy="100" r="4" fill="#B6F400" />
                      <circle cx="160" cy="70" r="4" fill="#B6F400" />
                      <circle cx="200" cy="90" r="4" fill="#B6F400" />
                      <circle cx="240" cy="40" r="4" fill="#B6F400" />
                      <circle cx="300" cy="60" r="4" fill="#B6F400" />
                    </svg>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-400">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                    <div>Jul</div>
                    <div>Aug</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1C2333] border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#B6F400]">Cost-Saving Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#2C3444] p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Current Stock Value</div>
                      <div className="text-xl font-semibold">$100,000</div>
                    </div>
                    <div className="bg-[#2C3444] p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Optimization Target</div>
                      <div className="text-xl font-semibold">15%</div>
                    </div>
                  </div>
                  <div className="bg-[#2C3444] p-4 rounded-lg mb-4">
                    <div className="text-sm text-gray-400 mb-1">Potential Savings</div>
                    <div className="text-xl font-semibold text-[#B6F400]">$15,000</div>
                  </div>
                  <Button className="w-full bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">Calculate</Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
                <QrCode className="mr-2 h-4 w-4" /> Barcode Scan
              </Button>
              <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
                <Repeat className="mr-2 h-4 w-4" /> Instant Transfer
              </Button>
              <Button variant="outline">
                <Clipboard className="mr-2 h-4 w-4" /> Inventory Count
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> CSV Export
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CompleteDashboard
