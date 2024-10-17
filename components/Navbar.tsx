"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: '📊' },
    { name: 'Clients', href: '/clients', icon: '👥' },
    { name: 'Factures', href: '/invoices', icon: '📄' },
    { name: 'Colis', href: '/packages', icon: '📦' },
    { name: 'Paiements', href: '/payments', icon: '💳' },
    { name: 'Transactions', href: '/transactions', icon: '🔄' },
    { name: 'Paramètres', href: '/settings', icon: '⚙️' },
  ];

  return (
    <nav className="bg-navbar text-navbar-foreground w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">CoBill CRM</div>
      <ul>
        {navItems.map((item) => (
          <li key={item.name} className="mb-2">
            <Link href={item.href}>
              <span
                className={`flex items-center p-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-navbar-active text-navbar-foreground'
                    : 'hover:bg-navbar-hover'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link href="/logout">
          <span className="flex items-center p-2 rounded-md hover:bg-navbar-hover">
            <span className="mr-2">🚪</span>
            Déconnexion
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
