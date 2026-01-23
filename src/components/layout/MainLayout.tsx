import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const MainLayout = ({ children, title, subtitle }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen to sidebar collapse state changes (you can implement this with context if needed)
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar className="hidden md:flex" />
      <div className="md:pl-64 transition-all duration-300">
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default MainLayout;