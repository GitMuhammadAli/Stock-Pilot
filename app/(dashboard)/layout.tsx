import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/topbar";
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#0B0F1A] text-white overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <TopBar />
            <div className="@container/main flex flex-1 flex-col p-4 md:p-6 overflow-auto">
              {/* <SidebarTrigger className="md:hidden mb-4" /> */}
              <main>{children}</main>
              <Toaster />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}