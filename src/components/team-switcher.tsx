"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function TeamSwitcher() {
  const router = useRouter();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => router.push("/dashboard")}>
          CEE
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
