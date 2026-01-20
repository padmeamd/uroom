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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon, isMain }) => {
          const isActive = location.pathname === path;
          
          if (isMain) {
            return (
              <Link
                key={path}
                to={path}
                className="relative -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                  <Icon size={24} className="text-primary-foreground" />
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={22} />
              <span className="text-2xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
