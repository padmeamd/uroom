import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Search },
    { path: '/create', label: 'Create', icon: Plus, isMain: true },
    { path: '/chats', label: 'Chats', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-primary/20 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon, isMain }) => {
          const isActive = location.pathname === path;
          
          if (isMain) {
            return (
              <Link
                key={path}
                to={path}
                className="relative -mt-6 group"
              >
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-accent/30 blur-xl -translate-x-1 -translate-y-1 group-hover:bg-accent/50 transition-colors" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-vhs-cyan to-primary flex items-center justify-center shadow-neon-green hover:scale-110 transition-transform relative">
                  <Icon size={24} className="text-primary-foreground" />
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary/80'
              }`}
            >
              <Icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_hsl(150,100%,50%)]' : ''} />
              <span className="text-2xs font-mono uppercase tracking-wider">{label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-neon-green" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
