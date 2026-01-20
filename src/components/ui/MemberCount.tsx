import { Users } from 'lucide-react';

interface MemberCountProps {
  current: number;
  max: number;
  size?: 'sm' | 'md';
}

export function MemberCount({ current, max, size = 'md' }: MemberCountProps) {
  const percentage = (current / max) * 100;
  const isFull = current >= max;
  const isAlmostFull = percentage >= 75;
  
  const sizeClasses = size === 'sm' ? 'text-xs gap-1' : 'text-sm gap-1.5';
  const iconSize = size === 'sm' ? 12 : 14;
  
  return (
    <div
      className={`inline-flex items-center ${sizeClasses} ${
        isFull
          ? 'text-destructive'
          : isAlmostFull
          ? 'text-uroom-amber'
          : 'text-muted-foreground'
      }`}
    >
      <Users size={iconSize} />
      <span className="font-medium">
        {current}/{max}
      </span>
      {isFull && <span className="text-2xs uppercase font-bold">Full</span>}
    </div>
  );
}
