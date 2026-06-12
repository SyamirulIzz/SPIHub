
"use client"

import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/toaster";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser, isLoaded } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !currentUser && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoaded, currentUser, pathname, router]);

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <title>SPI Hub | Internal System</title>
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        {isLoginPage ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col md:flex-row">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <MobileHeader />
                <main className="flex-1 overflow-auto pb-20 md:pb-0">
                  {children}
                </main>
                <BottomNav />
              </div>
            </div>
            <Toaster />
          </SidebarProvider>
        )}
      </body>
    </html>
  );
}
