import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Zap, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { User } from '@/types/room';

interface MemberProfileSheetProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MemberProfileSheet = ({ userId, open, onOpenChange }: MemberProfileSheetProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && open) {
      setLoading(true);
      api.get<User>(`/api/users/${userId}`)
        .then(setUser)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setUser(null);
    }
  }, [userId, open]);

  if (!open) return null;

  const xpToNextLevel = 1000;
  const xpPercent = user ? Math.min((user.xp % xpToNextLevel) / xpToNextLevel * 100, 100) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl border-t border-primary/30 bg-card max-h-[85vh] overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{user?.name ?? 'Profile'}</SheetTitle>
        </SheetHeader>

        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48 text-muted-foreground font-mono text-sm">
            LOADING...
          </div>
        )}

        {!loading && user && (
          <>
            {/* Profile header */}
            <div className="flex flex-col items-center px-6 pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Avatar className="w-20 h-20 border-2 border-primary/50 shadow-[var(--glow-green)]">
                  <AvatarImage src={user.photoUrl} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-mono">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <h2 className="text-lg font-bold text-foreground mt-3 font-mono">{user.name}</h2>
              {user.university && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{user.university}</p>
              )}
              {user.about && (
                <p className="text-sm text-muted-foreground text-center mt-2 max-w-[280px]">{user.about}</p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 px-6 pb-4">
              <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border">
                <Star size={16} className="text-primary mb-1" />
                <span className="text-sm font-bold text-foreground font-mono">LVL {user.level}</span>
                <span className="text-[10px] text-muted-foreground">Level</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border">
                <Zap size={16} className="text-accent mb-1" />
                <span className="text-sm font-bold text-foreground font-mono">{user.streak}d</span>
                <span className="text-[10px] text-muted-foreground">Streak</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border">
                <Calendar size={16} className="text-muted-foreground mb-1" />
                <span className="text-sm font-bold text-foreground font-mono">{user.xp} XP</span>
                <span className="text-[10px] text-muted-foreground">Total XP</span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-muted-foreground">XP TO NEXT LEVEL</span>
                <span className="text-xs font-mono text-primary">{user.xp % xpToNextLevel}/{xpToNextLevel}</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Interests */}
            {user.interests?.length > 0 && (
              <div className="px-6 pb-4">
                <span className="text-xs font-mono text-muted-foreground block mb-2">INTERESTS</span>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="border-accent/30 text-accent font-mono text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {user.skills?.length > 0 && (
              <div className="px-6 pb-6">
                <span className="text-xs font-mono text-muted-foreground block mb-2">SKILLS</span>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="border-primary/20 font-mono text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
