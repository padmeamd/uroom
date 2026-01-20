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
        isInteractive ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.bannerUrl}
          alt={room.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <RoomTypeBadge type={room.type} size="sm" />
          {room.isUrgent && <UrgentBadge size="sm" variant="urgent" />}
          {!room.isUrgent && isStartingSoon && (
            <UrgentBadge size="sm" variant="soon" />
          )}
        </div>
        
        {/* Member count badge */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <MemberCount current={room.currentMembers} max={room.maxMembers} size="sm" />
        </div>
        
        {/* Creator avatar */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <img
            src={room.creatorAvatar}
            alt={room.creatorName}
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            draggable={false}
          />
          <span className="text-white text-sm font-medium drop-shadow-md">
            {room.creatorName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
          {room.title}
        </h3>

        {/* Location & Time */}
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary shrink-0" />
            <span>{formatDateTime(room.dateTime)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {room.tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Role Requirements (for projects) */}
        {room.type === 'PROJECT' && room.roleRequirements.length > 0 && (
          <div className="pt-1">
            <p className="text-xs text-muted-foreground mb-1.5">Needs:</p>
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
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>Tap for details</span>
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
}
