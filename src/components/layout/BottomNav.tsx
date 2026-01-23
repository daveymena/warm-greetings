import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Wallet, CalendarCheck, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Préstamos', href: '/prestamos', icon: Wallet },
  { name: 'Cobros', href: '/cobros', icon: CalendarCheck },
  { name: 'Ajustes', href: '/configuracion', icon: Settings },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden safe-area-pb">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-all',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
              isActive && "bg-primary/10 scale-110"
            )}>
              <item.icon className={cn('h-5 w-5', isActive && 'drop-shadow-sm')} />
            </div>
            <span className={cn(isActive && "font-semibold")}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};