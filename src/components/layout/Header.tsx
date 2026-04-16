import { Bell, Sparkles, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onBellClick?: () => void;
  unreadCount?: number;
}

export function Header({ onBellClick, unreadCount = 0 }: HeaderProps) {
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-neon-green relative overflow-hidden">
          <span className="text-primary-foreground font-mono font-bold text-lg relative z-10">U</span>
          <div className="absolute inset-0 bg-gradient-to-br from-vhs-green/20 to-transparent" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground leading-none tracking-tight glitch-text">
            URoom
          </h1>
          <div className="flex items-center gap-1.5">
            <Radio size={8} className="text-primary animate-neon" />
            <p className="vhs-timestamp">REC • {timestamp}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
          <Sparkles size={20} className="text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent/10 transition-colors"
          onClick={onBellClick}
        >
          <Bell size={20} className="text-accent" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-vhs-pink rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-neon-purple">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
