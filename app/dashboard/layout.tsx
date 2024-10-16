"use client"

import { useState, createContext, useContext } from 'react'
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X } from 'lucide-react'

// Create a context for language
const LanguageContext = createContext<{
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}>({ language: 'fr', setLanguage: () => {} });

// French flag SVG
const FrenchFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="24" height="16">
    <rect width="3" height="2" fill="#ED2939"/>
    <rect width="2" height="2" fill="#fff"/>
    <rect width="1" height="2" fill="#002395"/>
  </svg>
);

// English flag SVG
const EnglishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="16">
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleLanguage = (lang: 'fr' | 'en') => {
    setLanguage(lang)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Simple translation object
  const translations = {
    fr: {
      dashboard: "Tableau de bord",
      clients: "Clients",
      invoices: "Factures",
      packages: "Colis",
      payments: "Paiements",
      transactions: "Transactions",
      settings: "Paramètres",
      logout: "Déconnexion"
    },
    en: {
      dashboard: "Dashboard",
      clients: "Clients",
      invoices: "Invoices",
      packages: "Packages",
      payments: "Payments",
      transactions: "Transactions",
      settings: "Settings",
      logout: "Logout"
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="flex min-h-screen bg-background">
        <aside className={`border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <SidebarNav translations={translations[language]} collapsed={sidebarCollapsed} />
        </aside>
        <div className="flex-1">
          <header className="border-b border-border">
            <div className="flex h-16 items-center px-4">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
                {sidebarCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
              </Button>
              <div className="ml-auto flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-16 justify-start px-2">
                      {language === 'fr' ? <FrenchFlag /> : <EnglishFlag />}
                      <span className="ml-2">{language.toUpperCase()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleLanguage('fr')}>
                      <FrenchFlag />
                      <span className="ml-2">FR</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleLanguage('en')}>
                      <EnglishFlag />
                      <span className="ml-2">EN</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-8 pt-6">
            {children}
          </main>
        </div>
      </div>
    </LanguageContext.Provider>
  )
}

// Export a custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
