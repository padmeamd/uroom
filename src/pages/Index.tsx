import { useState, useCallback, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { FilterBar } from '@/components/room/FilterBar';
import { SwipeCardStack } from '@/components/room/SwipeCardStack';
import { Room, UrgentFilter } from '@/types/room';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const [urgentFilter, setUrgentFilter] = useState<UrgentFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'EVENT' | 'PROJECT'>('all');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [swipedRooms, setSwipedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchRooms();
  }, [urgentFilter, typeFilter]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (urgentFilter !== 'all') params.append('filter', urgentFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      
      const data = await api.get<Room[]>(`/api/rooms?${params.toString()}`);
      setRooms(data);
    } catch (error) {
      toast.error('Failed to load rooms');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: UrgentFilter) => {
    setUrgentFilter(filter);
  };

  const handleTypeChange = (type: 'all' | 'EVENT' | 'PROJECT') => {
    setTypeFilter(type);
  };

  const handleSwipeLeft = useCallback((room: Room) => {
    setSwipedRooms(prev => [...prev, room]);
    setRooms(prev => prev.slice(1));
    toast.info(`Passed on "${room.title}"`, {
      duration: 2000,
    });
  }, []);

  const handleSwipeRight = useCallback(async (room: Room) => {
    setSwipedRooms(prev => [...prev, room]);
    setRooms(prev => prev.slice(1));
    
    try {
      await api.post(`/api/rooms/${room.id}/join?userId=${user!.id}`, {});

      if (room.roomType === 'EVENT' && room.autoAccept) {
        toast.success(`Joined "${room.title}"! 🎉`, {
          description: 'Check your chats to connect with the group.',
          duration: 3000,
        });
      } else if (room.roomType === 'PROJECT' && room.quizRequired) {
        toast('Application Required', {
          description: `Complete the quiz to join "${room.title}"`,
          action: {
            label: 'Start',
            onClick: () => console.log('Open quiz'),
          },
          duration: 4000,
        });
      } else {
        toast.success(`Request sent for "${room.title}"!`, {
          description: 'Waiting for creator approval.',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to join room');
      console.error(error);
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (swipedRooms.length === 0) return;
    const lastRoom = swipedRooms[swipedRooms.length - 1];
    setSwipedRooms(prev => prev.slice(0, -1));
    setRooms(prev => [lastRoom, ...prev]);
    toast.info('Undone!', { duration: 1500 });
  }, [swipedRooms]);

  return (
    <AppLayout header={
      <Header
        onBellClick={() => setNotificationsOpen(true)}
        unreadCount={unreadCount}
      />
    }>
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onUnreadChange={setUnreadCount}
      />
      <div className="px-4 pt-4 pb-6">
        <div className="mb-4">
          <h2 className="text-xl font-display font-bold text-foreground glitch-text">
            ◈ FIND YOUR ROOM
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            SWIPE → JOIN • SWIPE ← PASS
          </p>
        </div>
        <FilterBar
          activeFilter={urgentFilter}
          onFilterChange={handleFilterChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
        />
      </div>
      <div className="px-4 relative">
        <div className="absolute inset-0 retro-grid opacity-30 pointer-events-none" />
        <SwipeCardStack
          rooms={rooms}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onUndo={handleUndo}
          canUndo={swipedRooms.length > 0}
          loading={loading}
        />
      </div>
    </AppLayout>
  );
};

export default Index;
