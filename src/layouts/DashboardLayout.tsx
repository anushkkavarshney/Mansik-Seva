import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardLoader } from "@/components/DashboardLoader";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "student" | "admin";
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <DashboardLoader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      {/* Desktop Sidebar - Fixed/Sticky */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-40">
        <Sidebar userType={userType} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative">
            <Sidebar userType={userType} />
          </div>
        </div>
      )}

      {/* Main Content Area - With left margin for sidebar */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-72">
        <TopBar 
          userType={userType} 
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}