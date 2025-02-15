"use client";

import "../globals.css";
import { AuthProvider, useAuth } from "@/context/use-auth";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <AuthProvider>
        <SidebarProvider>
          <AuthenticatedContent>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                  {/* <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="#">
                            Building Your Application
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb> */}
                </div>
              </header>
              {children}
            </SidebarInset>
          </AuthenticatedContent>
        </SidebarProvider>
      </AuthProvider>
      <Toaster />
    </React.Fragment>
  );
}
