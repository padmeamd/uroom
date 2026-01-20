import { Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">U</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-none">URoom</h1>
          <p className="text-2xs text-muted-foreground">UCLA</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Sparkles size={20} className="text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-uroom-coral rounded-full" />
        </Button>
      </div>
    </div>
  );
}
