import { Room } from '@/types/room';
import { RoomTypeBadge, UrgentBadge } from '@/components/ui/RoomTypeBadge';
import { MemberCount } from '@/components/ui/MemberCount';
import { RoleProgress } from '@/components/ui/RoleProgress';
import { AIRecommendation } from '@/components/ui/AIRecommendation';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';

interface RoomCardProps {
  room: Room;
  isInteractive?: boolean;
  onClick?: () => void;
}

export function RoomCard({ room, isInteractive = true, onClick }: RoomCardProps) {
  const formatDateTime = (date: Date) => {
    if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
    const daysAway = differenceInDays(date, new Date());
    if (daysAway <= 7) return `${format(date, 'EEEE')}, ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, h:mm a');
  };

  const isStartingSoon = differenceInDays(room.dateTime, new Date()) <= 1;

  return (
    <div
      className={`card-elevated overflow-hidden h-full flex flex-col ${
        isInteractive ? 'cursor-pointer group' : ''
      }`}
      onClick={onClick}
    >
      {/* Banner Image with VHS effect */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.bannerUrl}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{
            filter: 'saturate(1.2) contrast(1.1)',
          }}
          draggable={false}
        />
        {/* VHS overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <RoomTypeBadge type={room.type} size="sm" />
          {room.isUrgent && <UrgentBadge size="sm" variant="urgent" />}
          {!room.isUrgent && isStartingSoon && (
            <UrgentBadge size="sm" variant="soon" />
          )}
        </div>
        
        {/* Member count badge */}
        <div className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded px-2 py-1 border border-primary/30">
          <MemberCount current={room.currentMembers} max={room.maxMembers} size="sm" />
        </div>
        
        {/* Creator avatar */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={room.creatorAvatar}
              alt={room.creatorName}
              className="w-8 h-8 rounded border-2 border-primary object-cover"
              draggable={false}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary animate-neon" />
          </div>
          <span className="text-foreground text-sm font-mono font-medium drop-shadow-md">
            @{room.creatorName.toLowerCase().replace(' ', '_')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-lg font-display font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {room.title}
        </h3>

        {/* Location & Time */}
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate font-mono text-xs">{room.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-accent shrink-0" />
            <span className="vhs-timestamp">{formatDateTime(room.dateTime)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {room.tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="text-2xs px-2 py-0.5 rounded bg-secondary/50 text-secondary-foreground font-mono uppercase tracking-wider border border-primary/20"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Role Requirements (for projects) */}
        {room.type === 'PROJECT' && room.roleRequirements.length > 0 && (
          <div className="pt-1">
            <p className="text-2xs text-accent font-mono uppercase tracking-wider mb-1.5">◈ ROLES NEEDED:</p>
            <RoleProgress roles={room.roleRequirements} compact />
          </div>
        )}

        {/* AI Recommendation */}
        {room.aiRecommendation && (
          <div className="mt-auto pt-2">
            <AIRecommendation reasons={room.aiRecommendation.reasons} compact />
          </div>
        )}
      </div>

      {/* Quick action hint */}
      {isInteractive && (
        <div className="px-4 py-3 border-t border-primary/20 flex items-center justify-between text-sm text-muted-foreground bg-card/50">
          <span className="font-mono text-2xs uppercase tracking-wider">▶ TAP FOR DETAILS</span>
          <ChevronRight size={16} className="text-primary" />
        </div>
      )}
    </div>
  );
}
