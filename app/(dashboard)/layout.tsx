import ProtectedRoute from "@/components/ProtectedRoute";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        {/* <SidebarTrigger /> */}
        {/* <Sidebar /> */}
        <main>{children}</main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
