"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Warehouse, Package, BarChart2, FileText, Settings, Users, Menu, X, Bell, Search, ChevronDown, LogOut, CreditCard, HelpCircle, User, Shield, Zap, Clock, AlertTriangle, DollarSign, TrendingUp, Filter, Download, QrCode, Repeat, Plus, Calendar, CheckCircle, RefreshCw, MoreHorizontal, ChevronRight, Star, Layers, Truck, Clipboard, PieChart, ArrowUpRight, ArrowDownRight, Mail } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <aside className={`bg-bg-secondary w-64 min-h-screen flex-shrink-0 flex flex-col z-40 transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'md:w-64' : 'md:w-20'
    } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className={`flex items-center p-4 h-16 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {sidebarOpen ? (
          <h1 className="text-2xl font-bold text-brand-primary">StockPilot</h1>
        ) : (
          <div className="w-10 h-10 bg-brand-primary rounded-md flex items-center justify-center">
            <span className="text-bg-primary font-bold text-xl">S</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
          <ChevronRight className={`h-5 w-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          {sidebarOpen && <p className="text-xs font-semibold text-muted mb-2">MAIN</p>}
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} ${pathname === '/dashboard' ? 'bg-bg-tertiary' : ''}`}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Dashboard</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/warehouse">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} ${pathname === '/warehouses' ? 'bg-bg-tertiary' : ''}`}
                >
                  <Warehouse className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Warehouses</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} ${pathname === '/products' ? 'bg-bg-tertiary' : ''}`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Products</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/inventory">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} ${pathname === '/inventory' ? 'bg-bg-tertiary' : ''}`}
                >
                  <Layers className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Inventory</span>}
                </Button>
              </Link>
            </li>
          </ul>
        </div>

        <div className="px-4 mb-2">
          {sidebarOpen && <p className="text-xs font-semibold text-muted mb-2 mt-6">ANALYTICS</p>}
          <ul className="space-y-1">
            <li>
              <Link href="/reports">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} ${pathname === '/reports' ? 'bg-bg-tertiary' : ''}`}
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Reports</span>}
                </Button>
              </Link>
            </li>
          </ul>
        </div>

        <div className="px-4">
          {sidebarOpen && <p className="text-xs font-semibold text-muted mb-2 mt-6">ADMIN</p>}
          <ul className="space-y-1">
            <li>
              <Link href="/settings">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} ${pathname === '/settings' ? 'bg-bg-tertiary' : ''}`}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Settings</span>}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="p-4 mt-auto">
          <Card className="bg-bg-tertiary border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-brand-primary text-bg-primary">Pro Plan</Badge>
                <span className="text-xs text-muted">25 days left</span>
              </div>
              <Progress value={65} className="h-1 mb-2" />
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className={`p-4 border-t border-bg-tertiary ${sidebarOpen ? '' : 'flex justify-center'}`}>
        {sidebarOpen ? (
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted">Admin</p>
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
  )
}
