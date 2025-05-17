"use client"

import ProtectedRoute from "@/components/ProtectedRoute";
import { AppSidebar , SidebarContext} from "@/components/app-sidebar";
import TopBar from "@/components/topbar";
import { Toaster } from "@/components/ui/toaster"
import { SidebarTrigger } from "@/components/ui/sideBarTrigger";
import { useState , useEffect} from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, sidebar is closed by default
      if (mobile) {
        setIsOpen(false);
        setIsSidebarVisible(false);
      } else {
        // On desktop, sidebar is always visible (either expanded or collapsed)
        setIsSidebarVisible(true);
        // You can choose default state for desktop here
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      // On mobile, toggle visibility
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      // On desktop, toggle expansion
      setIsOpen(!isOpen);
    }
  };

  return (
    <ProtectedRoute>
      <SidebarContext.Provider value={{ 
        isOpen, 
        setIsOpen, 
        isMobile, 
        isSidebarVisible, 
        setIsSidebarVisible,
        toggleSidebar 
      }}>
        <div className="flex h-screen bg-[#0B0F1A] text-white overflow-hidden">
          {/* Mobile overlay when sidebar is open */}
          {isMobile && isSidebarVisible && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsSidebarVisible(false)}
            />
          )}
          
          {/* Sidebar with conditional rendering for mobile */}
          <div className={`${isSidebarVisible ? 'block' : 'hidden'} md:block`}>
            <AppSidebar />
          </div>
          
          {/* Main content area that adjusts based on sidebar state */}
          <div 
            className="flex flex-1 flex-col transition-all duration-300 ease-in-out"
            style={{ 
              marginLeft: isMobile ? 0 : 'auto',
              width: isMobile ? '100%' : isOpen ? 'calc(100% - 16rem)' : 'calc(100% - 4rem)'
            }}
          >
            <TopBar />
            <div className="@container/main flex flex-1 flex-col p-4 md:p-6 overflow-auto">
              <SidebarTrigger
                className="md:hidden mb-4"
                onClick={toggleSidebar}
              />
              <main>{children}</main>
              <Toaster />
            </div>
          </div>
        </div>
      </SidebarContext.Provider>
    </ProtectedRoute>
  );
}
