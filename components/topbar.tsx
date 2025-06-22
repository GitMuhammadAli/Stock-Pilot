// "use client"

// import { useState } from "react"
// import { Bell, Search, LogOut, User } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import Link from "next/link"
// // import { useUserStore } from "@/lib/store"
// import { useAuth } from "@/providers/AuthProvider";
// import LogoutButton from "@/components/logout";
// import { SidebarTrigger } from "./ui/sideBarTrigger"

// export default function TopBar() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const { user, isAuthenticated } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   return (
//     <div className="bg-[#1C2333] p-4 flex items-center justify-between border-b border-[#2C3444]">
//         <div className="flex items-center flex-1 ml-2 md:ml-0">
//         <Search className="h-5 w-5 text-gray-400 mr-2" />
//         <Input
//           type="search"
//           placeholder="Search products, warehouses..."
//           className="max-w-md bg-[#2C3444] border-none text-white"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//       <div className="flex items-center space-x-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-0 right-0 h-2 w-2 bg-[#B6F400] rounded-full"></span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-80">
//             <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <div className="max-h-80 overflow-y-auto">
//               <DropdownMenuItem className="flex flex-col items-start">
//                 <p className="font-medium">Low stock alert</p>
//                 <p className="text-sm text-gray-500">Product XYZ is running low</p>
//                 <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
//               </DropdownMenuItem>
//               <DropdownMenuItem className="flex flex-col items-start">
//                 <p className="font-medium">New order received</p>
//                 <p className="text-sm text-gray-500">Order #12345 has been placed</p>
//                 <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
//               </DropdownMenuItem>
//             </div>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {user ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="flex items-center space-x-2">
//                 <div className="w-8 h-8 rounded-full bg-[#B6F400] flex items-center justify-center text-[#0B0F1A] font-bold">
//                   {user.name.charAt(0)}
//                 </div>
//                 <span className="hidden md:inline text-sm">{user.name}</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                                 <LogoutButton />
                
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <div className="flex items-center space-x-2">
//             <Link href="/auth/login">
//               <Button variant="ghost">Login</Button>
//             </Link>
//             <Link href="/auth/signup">
//               <Button className="bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">Sign Up</Button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";

export default function TopBar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="h-16 bg-[#1C2333] border-b border-[#2C3444] flex items-center justify-between px-6">
      {/* Search Section */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#0B0F1A] border border-[#2C3444] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#B6F400] transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2C3444] rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 text-gray-400 hover:text-white hover:bg-[#2C3444] rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-[#B6F400] rounded-full flex items-center justify-center">
              <span className="text-[#0B0F1A] font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{user?.email || ''}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1C2333] border border-[#2C3444] rounded-lg shadow-lg z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-[#2C3444]">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#B6F400] text-[#0B0F1A] rounded">
                    {user?.role}
                  </span>
                </div>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2C3444] transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#2C3444] transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
