import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  header?: ReactNode;
}

export function AppLayout({ children, showNav = true, header }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {header && (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          {header}
        </header>
      )}
      <main className={`flex-1 ${showNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
