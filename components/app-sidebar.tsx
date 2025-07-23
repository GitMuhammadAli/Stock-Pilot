"use client"

import { useEffect, useState, createContext, useContext } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import TopBar from "@/components/topbar"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Warehouse, Package, Layers, BarChart2, Settings, ChevronRight, MoreHorizontal, LogOut, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Create the sidebar context
export const SidebarContext = createContext({
  isOpen: true,
  setIsOpen: (value: boolean) => {},
  isMobile: false,
  isSidebarVisible: true,
  setIsSidebarVisible: (value: boolean) => {},
  toggleSidebar: () => {}
})

// Use this hook in components to access sidebar state
export const useSidebar = () => useContext(SidebarContext)

// SidebarTrigger component for mobile
export function SidebarTrigger({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen, isMobile } = useSidebar()

  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`w-full justify-start ${isOpen ? "pl-4" : "justify-center"} ${
          pathname === href ? "bg-bg-primary" : ""
        }`}
      >
        <Icon className="h-5 w-5 mr-2" />
        {isOpen && <span>{label}</span>}
      </Button>
    </Link>
  )

  return (
    <aside
      className={`bg-bg-secondary h-screen transition-all duration-300 ease-in-out flex flex-col fixed md:sticky top-0 left-0 ${
        isOpen ? "w-64" : "w-16"
      } z-40`}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {isOpen ? (
          <h1 className="text-2xl font-bold text-brand-primary">StockPilot</h1>
        ) : (
          <div className="w-10 h-10 bg-brand-primary rounded-md flex items-center justify-center">
            <span className="text-bg-primary font-bold text-xl">S</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="hidden md:flex">
          <ChevronRight className={`h-5 w-5 transition-transform ${!isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto py-4 px-2">
        <div>
          {isOpen && <p className="text-xs text-muted mb-1">MAIN</p>}
          <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem href="/warehouse" label="Warehouses" icon={Warehouse} />
          <NavItem href="/suppliers" label="Supplier" icon={User} />
          <NavItem href="/products" label="Products" icon={Package} />
          <NavItem href="/inventory" label="Inventory" icon={Layers} />
          <NavItem href="/orders" label="Orders" icon={Package} />
        </div>

        <div>
          {isOpen && <p className="text-xs text-muted mb-1 mt-4">ANALYTICS</p>}
          <NavItem href="/reports" label="Reports" icon={BarChart2} />
        </div>

        <div>
          {isOpen && <p className="text-xs text-muted mb-1 mt-4">ADMIN</p>}
          <NavItem href="/settings" label="Settings" icon={Settings} />
        </div>
      </nav>

      {isOpen && (
        <div className="p-4">
          <Card className="bg-bg-tertiary border-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-brand-primary text-bg-primary">Pro Plan</Badge>
                <span className="text-xs text-muted">25 days left</span>
              </div>
              <div className="bg-muted h-1 rounded-full w-full mb-2">
                <div className="bg-brand-primary h-1 rounded-full" style={{ width: "65%" }} />
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className={`p-4 border-t border-bg-tertiary ${isOpen ? "" : "flex justify-center"}`}>
        {isOpen ? (
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
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
              <DropdownMenuContent align="end" className="w-48">
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
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        )}
      </div>
    </aside>
  )
}