"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  Settings,
  CreditCard,
  RefreshCcw,
  LogOut
} from "lucide-react"

interface Translations {
  dashboard: string;
  clients: string;
  invoices: string;
  packages: string;
  payments: string;
  transactions: string;
  settings: string;
  logout: string;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  translations: Translations;
  collapsed: boolean;
}

export function SidebarNav({ className, translations, collapsed, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const sidebarNavItems = [
    {
      title: translations.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: translations.clients,
      href: "/dashboard/clients",
      icon: Users,
    },
    {
      title: translations.invoices,
      href: "/dashboard/invoices",
      icon: FileText,
    },
    {
      title: translations.packages,
      href: "/dashboard/packages",
      icon: Package,
    },
    {
      title: translations.payments,
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: translations.transactions,
      href: "/dashboard/transactions",
      icon: RefreshCcw,
    },
    {
      title: translations.settings,
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className={cn("pb-12 bg-secondary", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight text-primary", collapsed && "text-center")}>
            {collapsed ? "CRM" : "CoBill CRM"}
          </h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-secondary-foreground hover:bg-primary/10 hover:text-primary",
                  collapsed && "justify-center px-2"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <Button variant="ghost" className={cn("w-full justify-start text-secondary-foreground hover:bg-primary/10 hover:text-primary", collapsed && "justify-center px-2")}>
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && translations.logout}
        </Button>
      </div>
    </div>
  )
}
