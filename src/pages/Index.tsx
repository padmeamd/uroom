import { useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/room/FilterBar';
import { SwipeCardStack } from '@/components/room/SwipeCardStack';
import { mockRooms, getFilteredRooms } from '@/data/mockRooms';
import { Room, UrgentFilter } from '@/types/room';
import { toast } from 'sonner';

const Index = () => {
  const [urgentFilter, setUrgentFilter] = useState<UrgentFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'EVENT' | 'PROJECT'>('all');
  const [rooms, setRooms] = useState<Room[]>(() => 
    getFilteredRooms(mockRooms, 'all', 'all')
  );
  const [swipedRooms, setSwipedRooms] = useState<Room[]>([]);

  const handleFilterChange = (filter: UrgentFilter) => {
    setUrgentFilter(filter);
    setRooms(getFilteredRooms(mockRooms, filter, typeFilter));
  };

  const handleTypeChange = (type: 'all' | 'EVENT' | 'PROJECT') => {
    setTypeFilter(type);
    setRooms(getFilteredRooms(mockRooms, urgentFilter, type));
  };

  const handleSwipeLeft = useCallback((room: Room) => {
    setSwipedRooms(prev => [...prev, room]);
    setRooms(prev => prev.slice(1));
    toast.info(`Passed on "${room.title}"`, {
      duration: 2000,
    });
  }, []);

  const handleSwipeRight = useCallback((room: Room) => {
    setSwipedRooms(prev => [...prev, room]);
    setRooms(prev => prev.slice(1));
    
    if (room.type === 'EVENT' && room.autoAccept) {
      toast.success(`Joined "${room.title}"! 🎉`, {
        description: 'Check your chats to connect with the group.',
        duration: 3000,
      });
    } else if (room.type === 'PROJECT' && room.quizRequired) {
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
  }, []);

  const handleUndo = useCallback(() => {
    if (swipedRooms.length === 0) return;
    const lastRoom = swipedRooms[swipedRooms.length - 1];
    setSwipedRooms(prev => prev.slice(0, -1));
    setRooms(prev => [lastRoom, ...prev]);
    toast.info('Undone!', { duration: 1500 });
  }, [swipedRooms]);

  return (
    <AppLayout header={<Header />}>
      <div className="px-4 pt-4 pb-6">
        {/* Welcome message */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Find Your Room
          </h2>
          <p className="text-sm text-muted-foreground">
            Swipe right to join, left to pass
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          activeFilter={urgentFilter}
          onFilterChange={handleFilterChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
        />
      </div>

      {/* Swipe Cards */}
      <div className="px-4">
        <SwipeCardStack
          rooms={rooms}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onUndo={handleUndo}
          canUndo={swipedRooms.length > 0}
        />
      </div>
    </AppLayout>
  );
};

export default Index;
