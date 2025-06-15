import { ModeToggle } from "@/components/shared/switch"
import { CheckCircle, Globe, Search, Shield, Zap } from "lucide-react"
import type React from "react"
import { Suspense } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-card border-r border-border text-card-foreground p-8 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Search className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">DeadLink Watchdog</span>
                <div className="text-xs text-muted-foreground font-medium">WEBSITE MONITORING</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-3 leading-tight text-foreground">
                  Monitor Nigerian Websites
                  <span className="block text-primary">with Confidence</span>
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Join thousands of businesses keeping their websites healthy across Nigeria&apos;s digital landscape.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary">24/7</div>
                  <div className="text-xs text-muted-foreground">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent-foreground">5k+</div>
                  <div className="text-xs text-muted-foreground">Websites</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption" },
                  { icon: Zap, title: "Lightning Fast", desc: "Real-time monitoring" },
                  { icon: Globe, title: "Nigeria-Focused", desc: "Optimized infrastructure" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🇳🇬</span>
              <span className="text-xs text-muted-foreground">Made in Nigeria</span>
            </div>
            <div className="flex items-center space-x-1 text-primary">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">5,000+ businesses</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col bg-background">
          {/* Header */}
          <header className="border-b border-border bg-background/95 backdrop-blur">
            <div className="px-6">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center lg:hidden">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground">DeadLink Watchdog</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>All systems operational</span>
                  </div>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>Secure Authentication</span>
                </div>
              </div>
              <Suspense>{children}</Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
