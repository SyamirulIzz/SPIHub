
"use client"

import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider, useCurrentUser } from "@/hooks/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoaded } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !currentUser && pathname !== "/login") {
      router.push("/login");
    }
    if (isLoaded && currentUser && pathname === "/login") {
      router.push("/");
    }
  }, [isLoaded, currentUser, pathname, router]);

  const isLoginPage = pathname === "/login";

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/20"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing SPI HUB...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
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
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <title>SPI Hub | Internal System</title>
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        <UserProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </UserProvider>
      </body>
    </html>
  );
}
