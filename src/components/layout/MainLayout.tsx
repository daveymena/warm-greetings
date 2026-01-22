import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const MainLayout = ({ children, title, subtitle }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar className="hidden md:flex" />
      <div className="md:pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
