import { RoomType } from '@/types/room';
import { Calendar, Briefcase, Zap, Clock } from 'lucide-react';

interface RoomTypeBadgeProps {
  type: RoomType;
  size?: 'sm' | 'md';
}

export function RoomTypeBadge({ type, size = 'md' }: RoomTypeBadgeProps) {
  const isEvent = type === 'EVENT';
  const sizeClasses = size === 'sm' ? 'text-2xs px-2 py-0.5' : 'text-xs px-3 py-1';
  const iconSize = size === 'sm' ? 10 : 12;
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-widest rounded ${sizeClasses} ${
        isEvent ? 'badge-event' : 'badge-project'
      }`}
    >
      {isEvent ? <Calendar size={iconSize} /> : <Briefcase size={iconSize} />}
      {type}
    </span>
  );
}

interface UrgentBadgeProps {
  size?: 'sm' | 'md';
  variant?: 'urgent' | 'soon' | 'this-week';
}

export function UrgentBadge({ size = 'md', variant = 'urgent' }: UrgentBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-2xs px-2 py-0.5' : 'text-xs px-3 py-1';
  const iconSize = size === 'sm' ? 10 : 12;
  
  const variants = {
    urgent: { label: '⚡ URGENT', icon: Zap },
    soon: { label: '◉ LIVE SOON', icon: Clock },
    'this-week': { label: '▶ THIS WEEK', icon: Calendar },
  };
  
  const { label, icon: Icon } = variants[variant];
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-widest rounded ${sizeClasses} badge-urgent`}
    >
      {label}
    </span>
  );
}
