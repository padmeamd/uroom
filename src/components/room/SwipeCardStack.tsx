import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Room } from '@/types/room';
import { RoomCard } from './RoomCard';
import { X, Heart, RotateCcw, Tv } from 'lucide-react';
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
        <div className="w-20 h-20 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center mb-4 shadow-neon-purple">
          <Tv size={32} className="text-accent animate-neon" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-2 glitch-text">
          ◈ END OF TAPE
        </h3>
        <p className="text-muted-foreground font-mono text-sm">
          REWIND OR ADJUST FILTERS TO CONTINUE
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
          <div className="absolute inset-0 transform scale-[0.95] translate-y-3 opacity-40">
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
              className="absolute top-8 left-8 bg-destructive text-destructive-foreground font-mono font-bold text-xl px-4 py-2 rounded transform -rotate-12 opacity-0 pointer-events-none shadow-neon-purple"
              style={{
                opacity: isDragging ? 0 : 0,
              }}
            >
              ✕ PASS
            </motion.div>
            <motion.div
              className="absolute top-8 right-8 bg-primary text-primary-foreground font-mono font-bold text-xl px-4 py-2 rounded transform rotate-12 opacity-0 pointer-events-none shadow-neon-green"
              style={{
                opacity: isDragging ? 0 : 0,
              }}
            >
              ♥ JOIN
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-14 h-14 rounded-lg border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:shadow-[0_0_20px_hsl(340,90%,55%,0.5)]"
          onClick={() => handleButtonSwipe('left')}
        >
          <X size={24} />
        </Button>
        
        {canUndo && (
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 rounded-lg border-accent/50 text-accent hover:bg-accent/20 transition-all"
            onClick={onUndo}
          >
            <RotateCcw size={20} />
          </Button>
        )}
        
        <Button
          size="lg"
          className="w-14 h-14 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-neon-green hover:shadow-[0_0_30px_hsl(150,100%,50%,0.6)]"
          onClick={() => handleButtonSwipe('right')}
        >
          <Heart size={24} />
        </Button>
      </div>
    </div>
  );
}
