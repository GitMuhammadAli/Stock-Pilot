"use client"

import { useState } from "react"
import { Bell, Search, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
// import { useUserStore } from "@/lib/store"
import { useAuth } from "@/providers/AuthProvider";
import LogoutButton from "@/components/logout";



export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="bg-[#1C2333] p-4 flex items-center justify-between border-b border-[#2C3444]">
      <div className="flex items-center flex-1 ml-2 md:ml-0">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          type="search"
          placeholder="Search products, warehouses..."
          className="max-w-md bg-[#2C3444] border-none text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4">
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
              <DropdownMenuItem className="flex flex-col items-start">
                <p className="font-medium">Low stock alert</p>
                <p className="text-sm text-gray-500">Product XYZ is running low</p>
                <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <p className="font-medium">New order received</p>
                <p className="text-sm text-gray-500">Order #12345 has been placed</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#B6F400] flex items-center justify-center text-[#0B0F1A] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:inline text-sm">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                                <LogoutButton />
                
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

