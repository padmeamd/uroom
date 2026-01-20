import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Room } from '@/types/room';
import { RoomCard } from './RoomCard';
import { X, Heart, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeCardStackProps {
  rooms: Room[];
  onSwipeLeft: (room: Room) => void;
  onSwipeRight: (room: Room) => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function SwipeCardStack({
  rooms,
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  canUndo = false,
}: SwipeCardStackProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentRoom = rooms[0];
  const nextRoom = rooms[1];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitDirection('right');
      onSwipeRight(currentRoom);
    } else if (info.offset.x < -threshold) {
      setExitDirection('left');
      onSwipeLeft(currentRoom);
    }
    setIsDragging(false);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (!currentRoom) return;
    setExitDirection(direction);
    if (direction === 'left') {
      onSwipeLeft(currentRoom);
    } else {
      onSwipeRight(currentRoom);
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
        <div className="w-20 h-20 rounded-full bg-uroom-sky-light flex items-center justify-center mb-4">
          <Heart size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          You've seen all Rooms!
        </h3>
        <p className="text-muted-foreground">
          Check back later for new rooms or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Card Stack */}
      <div className="relative h-[520px]">
        {/* Background card (next) */}
        {nextRoom && (
          <div className="absolute inset-0 transform scale-[0.95] translate-y-2 opacity-50">
            <RoomCard room={nextRoom} isInteractive={false} />
          </div>
        )}

        {/* Current card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoom.id}
            className="absolute inset-0 swipe-card"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: isDragging ? 0 : 0,
            }}
            exit={{
              x: exitDirection === 'left' ? -500 : 500,
              opacity: 0,
              rotate: exitDirection === 'left' ? -20 : 20,
              transition: { duration: 0.3 },
            }}
            whileDrag={{
              scale: 1.02,
              cursor: 'grabbing',
            }}
          >
            <RoomCard room={currentRoom} isInteractive />
            
            {/* Swipe indicators */}
            <motion.div
              className="absolute top-8 left-8 bg-destructive text-destructive-foreground font-bold text-2xl px-6 py-2 rounded-xl transform -rotate-12 opacity-0 pointer-events-none"
              style={{
                opacity: isDragging ? 0 : 0,
              }}
            >
              NOPE
            </motion.div>
            <motion.div
              className="absolute top-8 right-8 bg-accent text-accent-foreground font-bold text-2xl px-6 py-2 rounded-xl transform rotate-12 opacity-0 pointer-events-none"
              style={{
                opacity: isDragging ? 0 : 0,
              }}
            >
              JOIN
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
          onClick={() => handleButtonSwipe('left')}
        >
          <X size={24} />
        </Button>
        
        {canUndo && (
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 rounded-full"
            onClick={onUndo}
          >
            <RotateCcw size={20} />
          </Button>
        )}
        
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all"
          onClick={() => handleButtonSwipe('right')}
        >
          <Heart size={24} />
        </Button>
      </div>
    </div>
  );
}
