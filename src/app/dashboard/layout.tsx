"use client"

import { DashboardSidebar } from "@/components/layout/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = []

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        const href = "/" + segments.slice(0, i + 1).join("/")
        const isLast = i === segments.length - 1

        // Format segment name
        const name = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

        breadcrumbs.push({
            name,
            href,
            isLast,
        })
    }

    return breadcrumbs
}

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const pathname = usePathname()
    const breadcrumbs = generateBreadcrumbs(pathname)

    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                    {/* Breadcrumbs */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((breadcrumb, index) => (
                                <div key={breadcrumb.href} className="flex items-center">
                                    {index > 0 && <BreadcrumbSeparator className="mx-2" />}
                                    <BreadcrumbItem>
                                        {breadcrumb.isLast ? (
                                            <BreadcrumbPage className="font-medium">{breadcrumb.name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={breadcrumb.href} className="text-muted-foreground hover:text-foreground">
                                                {breadcrumb.name}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header Actions */}
                    <div className="ml-auto flex items-center space-x-2">
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span>All systems operational</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-6 space-y-6">{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
