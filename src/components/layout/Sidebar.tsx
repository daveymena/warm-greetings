import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wallet,
  CalendarCheck,
  Settings,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Préstamos', href: '/prestamos', icon: Wallet },
  { name: 'Cobros del Día', href: '/cobros', icon: CalendarCheck },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1">
            <img src="/logo.png" alt="Rapi-Credi" className="h-full w-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rapi-Credi</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/50">
            © 2024 Rapi-Credi
          </p>
        </div>
      </div>
    </aside>
  );
};
