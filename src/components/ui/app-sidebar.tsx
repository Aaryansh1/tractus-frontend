"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./toggle-theme";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="mx-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <ModeToggle />
        </div>
        <SidebarGroup />
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2",
            pathname === "/dashboard" ? "text-primary" : "text-muted"
          )}
        >
          <Home size={20} />
          Home
        </Link>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
