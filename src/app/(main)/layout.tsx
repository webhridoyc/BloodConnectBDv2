
"use client"; // Make MainLayout a client component to use useAuth

import { Navbar } from "@/components/core/Navbar";
import { SupportChatbotWidget } from "@/components/ai/SupportChatbotWidget";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    // If authentication is still loading, show a full-page spinner.
    // This covers the initial load for non-auth pages.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <SupportChatbotWidget />
      {/* Optional Footer can be added here */}
      {/* <footer className="py-6 md:px-8 md:py-0 border-t bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} BloodLink BD. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
