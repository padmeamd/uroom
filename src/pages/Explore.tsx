import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search as SearchIcon, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RoomTypeBadge, UrgentBadge } from '@/components/ui/RoomTypeBadge';
import { MemberCount } from '@/components/ui/MemberCount';
import { MapPin, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { Room } from '@/types/room';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await api.get<Room[]>('/api/rooms');
      setRooms(data);
    } catch (error) {
      toast.error('Failed to load rooms');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const trendingTags = ['Film', 'Hackathon', 'Photography', 'Startup', 'Games', 'Coding'];

  return (
    <AppLayout
      header={
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">Explore</h1>
        </div>
      }
    >
      <div className="px-4 space-y-4">
        <div className="relative">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rooms, tags, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-0 input-focus"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Filter size={18} />
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Trending</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1.5 rounded-full text-sm bg-uroom-sky-light text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-mono">LOADING...</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                className="card-elevated p-3 flex gap-3 cursor-pointer"
              >
                <img
                  src={room.bannerUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200'}
                  alt={room.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground line-clamp-1 text-sm">
                      {room.title}
                    </h3>
                    <MemberCount current={room.currentMembers} max={room.maxMembers} size="sm" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <RoomTypeBadge type={room.roomType} size="sm" />
                    {room.isUrgent && <UrgentBadge size="sm" />}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="truncate">{room.location || 'Online'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(room.dateTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredRooms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-mono">NO ROOMS FOUND</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Explore;
