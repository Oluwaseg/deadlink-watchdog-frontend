"use client"

import { ModeToggle } from "@/components/shared/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    SidebarRail,
} from "@/components/ui/sidebar"
import { logout } from "@/features/auth/api/authApi"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import { BarChart3, ChevronRight, Globe, LogOut, Search, Settings, Shield, User } from "lucide-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Websites", href: "/dashboard/websites", icon: Globe },
    { name: "Broken Links", href: "/dashboard/broken-links", icon: Globe },
    { name: "Crawls", href: "/dashboard/crawls", icon: Search },
]

const secondaryNavigation = [{ name: "Settings", href: "/dashboard/settings", icon: Settings }]

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { data: user } = useCurrentUser()

    const handleLogout = async () => {
        try {
            await logout()
            router.push("/auth/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <Sidebar collapsible="icon" className="border-r border-border">
            <SidebarHeader className="border-b border-border">
                <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="group-data-[collapsible=icon]:hidden">
                            <span className="text-lg font-bold text-foreground">DeadLink</span>
                            <div className="text-xs text-muted-foreground font-medium">WATCHDOG</div>
                        </div>
                    </div>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <ModeToggle />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <NextLink href={item.href}>
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </NextLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryNavigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <NextLink href={item.href}>
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </NextLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Status Card */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <div className="mx-3 p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-card-foreground">System Status</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">All monitoring services operational</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <div className="font-medium text-primary">99.9%</div>
                                <div className="text-muted-foreground">Uptime</div>
                            </div>
                            <div>
                                <div className="font-medium text-secondary">24/7</div>
                                <div className="text-muted-foreground">Active</div>
                            </div>
                        </div>
                    </div>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            {user?.firstName?.[0] || user?.email?.[0] || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                                        <div className="text-sm font-medium text-foreground truncate">{user?.firstName || "User"}</div>
                                        <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-56">
                                <DropdownMenuItem asChild>
                                    <NextLink href="/dashboard/profile">
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </NextLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <NextLink href="/dashboard/settings">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </NextLink>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
