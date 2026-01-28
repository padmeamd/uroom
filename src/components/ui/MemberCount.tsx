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
  
  const sizeClasses = size === 'sm' ? 'text-2xs gap-1' : 'text-xs gap-1.5';
  const iconSize = size === 'sm' ? 10 : 12;
  
  return (
    <div
      className={`inline-flex items-center font-mono uppercase tracking-wider ${sizeClasses} ${
        isFull
          ? 'text-destructive'
          : isAlmostFull
          ? 'text-vhs-yellow'
          : 'text-primary'
      }`}
    >
      <Users size={iconSize} />
      <span className="font-bold">
        {current}/{max}
      </span>
      {isFull && <span className="text-2xs font-bold animate-neon">FULL</span>}
    </div>
  );
}
