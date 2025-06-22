// "use client"

// import ProtectedRoute from "@/components/ProtectedRoute";
// import { AppSidebar , SidebarContext} from "@/components/app-sidebar";
// import TopBar from "@/components/topbar";
// import { Toaster } from "@/components/ui/toaster"
// import { SidebarTrigger } from "@/components/ui/sideBarTrigger";
// import { useState , useEffect} from "react";


// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
      
//       // On mobile, sidebar is closed by default
//       if (mobile) {
//         setIsOpen(false);
//         setIsSidebarVisible(false);
//       } else {
//         // On desktop, sidebar is always visible (either expanded or collapsed)
//         setIsSidebarVisible(true);
//         // You can choose default state for desktop here
//         setIsOpen(true);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     if (isMobile) {
//       // On mobile, toggle visibility
//       setIsSidebarVisible(!isSidebarVisible);
//     } else {
//       // On desktop, toggle expansion
//       setIsOpen(!isOpen);
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <SidebarContext.Provider value={{ 
//         isOpen, 
//         setIsOpen, 
//         isMobile, 
//         isSidebarVisible, 
//         setIsSidebarVisible,
//         toggleSidebar 
//       }}>
//         <div className="flex h-screen bg-[#0B0F1A] text-white overflow-hidden">
//           {/* Mobile overlay when sidebar is open */}
//           {isMobile && isSidebarVisible && (
//             <div 
//               className="fixed inset-0 bg-black bg-opacity-50 z-30"
//               onClick={() => setIsSidebarVisible(false)}
//             />
//           )}
          
//           {/* Sidebar with conditional rendering for mobile */}
//           <div className={`${isSidebarVisible ? 'block' : 'hidden'} md:block`}>
//             <AppSidebar />
//           </div>
          
//           {/* Main content area that adjusts based on sidebar state */}
//           <div 
//             className="flex flex-1 flex-col transition-all duration-300 ease-in-out"
//             style={{ 
//               marginLeft: isMobile ? 0 : 'auto',
//               width: isMobile ? '100%' : isOpen ? 'calc(100% - 16rem)' : 'calc(100% - 4rem)'
//             }}
//           >
//             <TopBar />
//             <div className="@container/main flex flex-1 flex-col p-4 md:p-6 overflow-auto">
//               <SidebarTrigger
//                 className="md:hidden mb-4"
//                 onClick={toggleSidebar}
//               />
//               <main>{children}</main>
//               <Toaster />
//             </div>
//           </div>
//         </div>
//       </SidebarContext.Provider>
//     </ProtectedRoute>
//   );
// }


"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppSidebar, SidebarContext } from "@/components/app-sidebar";
import TopBar from "@/components/topbar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarTrigger } from "@/components/ui/sideBarTrigger";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  const pathname = usePathname();
  const prevPathnameRef = useRef<string>(pathname);
  // const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    if (!isHydrated) return;

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsOpen(false);
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
        setIsOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isHydrated]);

  // Handle smooth page transitions
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isAuthenticated) {
      setIsTransitioning(true);
      
      if (isMobile) {
        setIsSidebarVisible(false);
      }
      
      // if (transitionTimeoutRef.current) {
      //   clearTimeout(transitionTimeoutRef.current);
      // }
      
      // transitionTimeoutRef.current = setTimeout(() => {
      //   setIsTransitioning(false);
      //   prevPathnameRef.current = pathname;
      // }, 100); // Very fast transition
    }
    
    return () => {
      // if (transitionTimeoutRef.current) {
      //   clearTimeout(transitionTimeoutRef.current);
      // }
    };
  }, [pathname, isAuthenticated, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const sidebarContextValue = useMemo(() => ({
    isOpen,
    setIsOpen,
    isMobile,
    isSidebarVisible,
    setIsSidebarVisible,
    toggleSidebar,
  }), [isOpen, isMobile, isSidebarVisible]);

  // Don't render anything if not hydrated or still loading auth
  if (!isHydrated || isLoading) {
    return (
      <div className="flex h-screen bg-[#0B0F1A] text-white">
        <div className="w-16 bg-[#1C2333] flex-shrink-0"></div>
        <div className="flex-1 bg-[#0B0F1A]"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarContext.Provider value={sidebarContextValue}>
        <div className="flex h-screen bg-[#0B0F1A] text-white overflow-hidden">
          {/* Mobile overlay */}
          {isMobile && isSidebarVisible && (
            <div
              className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-200"
              onClick={() => setIsSidebarVisible(false)}
            />
          )}

          {/* Persistent Sidebar */}
          <div 
            className={`
              ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} 
              md:translate-x-0 
              fixed md:relative z-40 md:z-auto h-full
              transition-transform duration-200 ease-out
            `}
            style={{
              width: isOpen ? '16rem' : '4rem',
              willChange: 'transform, width'
            }}
          >
            <AppSidebar />
          </div>

          {/* Main content area */}
          <div
            className="flex flex-1 flex-col transition-all duration-200 ease-out"
            style={{
              marginLeft: isMobile ? 0 : 'auto',
              width: isMobile
                ? "100%"
                : isOpen
                ? "calc(100% - 16rem)"
                : "calc(100% - 4rem)",
              willChange: 'width, margin'
            }}
          >
            <TopBar />
            <div className="@container/main flex flex-1 flex-col p-4 md:p-6 overflow-auto">
              <SidebarTrigger
                className="md:hidden mb-4"
                onClick={toggleSidebar}
              />
              
              {/* Content with minimal transition */}
              <main 
                className={`
                  flex-1 transition-opacity duration-100 ease-out
                  ${isTransitioning ? 'opacity-95' : 'opacity-100'}
                `}
                style={{ willChange: 'opacity' }}
              >
                {children}
              </main>
              
              <Toaster />
            </div>
          </div>
        </div>
      </SidebarContext.Provider>
    </ProtectedRoute>
  );
}