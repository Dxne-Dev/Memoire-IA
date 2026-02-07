'use client'

import React, { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  FileText,
  Brain,
  Clock,
  Settings,
  User,
  CreditCard,
  PenTool,
  ChevronUp,
  LogOut,
  Crown,
} from "lucide-react"
import Link from "next/link"
import { DarkModeSwitch } from "@/components/ui/dark-mode-switch"

const menuItems = [
  {
    title: "Cockpit",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Mes Mémoires",
    url: "/projects",
    icon: PenTool,
  },
  {
    title: "Bibliothèque",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Historique",
    url: "/history",
    icon: Clock,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/me')
        if (!res.ok) throw new Error('Erreur utilisateur')
        const userData = await res.json()
        setUser(userData)
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sidebar-primary-foreground">
                  <PenTool className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MémoireAI</span>
                  <span className="truncate text-xs">Votre assistant IA</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "Utilisateur"} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'UT'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || 'Utilisateur'}</span>
                    <div className="flex items-center gap-1">
                      <span className="truncate text-xs">
                        {user?.plan ? user.plan : (user?.plan === undefined ? '...' : '')}
                      </span>
                      {user?.plan === 'Premium' && <Crown className="h-3 w-3 text-yellow-500" />}
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={state === "collapsed" ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Mon Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Abonnement
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" })
                  localStorage.removeItem("dashboard_last_activity")
                  window.location.href = "/login"
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
