"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NavLogout() {
  const router = useRouter();

  const handleSignOut = async () => {
    toast.promise(
      signOut({ redirect: false }).then(() => {
        router.push("/auth/login");
      }),
      {
        loading: "Signing out...",
        success: "Signed out successfully!",
        error: "Failed to sign out",
      },
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Button variant="outline" onClick={handleSignOut}>
            Logout
            <LogOutIcon />
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
