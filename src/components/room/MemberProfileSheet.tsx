import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Star, Zap, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface MemberProfile {
  id: string;
  name: string;
  avatar: string;
}

interface MemberProfileSheetProps {
  member: MemberProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockProfileData: Record<string, {
  bio: string;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  joinedDate: string;
  interests: string[];
  badges: { icon: string; label: string }[];
}> = {
  jamie: {
    bio: 'Board game enthusiast & amateur photographer. Always looking for creative collaborators!',
    level: 12,
    xp: 740,
    maxXp: 1000,
    streak: 7,
    joinedDate: 'Jan 2026',
    interests: ['Board Games', 'Photography', 'Film'],
    badges: [
      { icon: '🎲', label: 'Game Master' },
      { icon: '📸', label: 'Shutterbug' },
    ],
  },
  alex: {
    bio: 'Filmmaker & screenwriter. Currently working on a short film. Let\'s create something amazing.',
    level: 18,
    xp: 450,
    maxXp: 1000,
    streak: 14,
    joinedDate: 'Dec 2025',
    interests: ['Film', 'Writing', 'Music'],
    badges: [
      { icon: '🎬', label: 'Director' },
      { icon: '✍️', label: 'Storyteller' },
      { icon: '🔥', label: 'On Fire' },
    ],
  },
  sam: {
    bio: 'Strategy game lover. Catan champion 3 years running. Try me.',
    level: 9,
    xp: 300,
    maxXp: 1000,
    streak: 3,
    joinedDate: 'Feb 2026',
    interests: ['Board Games', 'Strategy', 'Cooking'],
    badges: [
      { icon: '🏆', label: 'Champion' },
    ],
  },
  sophie: {
    bio: 'Landscape & street photographer. Golden hour addict ☀️',
    level: 15,
    xp: 820,
    maxXp: 1000,
    streak: 21,
    joinedDate: 'Nov 2025',
    interests: ['Photography', 'Travel', 'Nature'],
    badges: [
      { icon: '📸', label: 'Shutterbug' },
      { icon: '🌅', label: 'Golden Hour' },
      { icon: '🔥', label: 'On Fire' },
    ],
  },
  marcus: {
    bio: 'Camera nerd & photo walk organizer. Let\'s explore the city together!',
    level: 11,
    xp: 600,
    maxXp: 1000,
    streak: 5,
    joinedDate: 'Jan 2026',
    interests: ['Photography', 'Urban Exploration', 'Tech'],
    badges: [
      { icon: '🗺️', label: 'Explorer' },
      { icon: '📷', label: 'Gear Head' },
    ],
  },
};

const defaultProfile = {
  bio: 'No bio yet.',
  level: 1,
  xp: 0,
  maxXp: 1000,
  streak: 0,
  joinedDate: 'Recently',
  interests: [],
  badges: [],
};

export const MemberProfileSheet = ({ member, open, onOpenChange }: MemberProfileSheetProps) => {
  if (!member) return null;

  const profile = mockProfileData[member.id] || defaultProfile;
  const xpPercent = (profile.xp / profile.maxXp) * 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl border-t border-primary/30 bg-card max-h-[85vh] overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{member.name}'s Profile</SheetTitle>
        </SheetHeader>

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Profile header */}
        <div className="flex flex-col items-center px-6 pb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Avatar className="w-20 h-20 border-2 border-primary/50 shadow-[var(--glow-green)]">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-mono">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <h2 className="text-lg font-bold text-foreground mt-3 font-mono">{member.name}</h2>
          <p className="text-sm text-muted-foreground text-center mt-1 max-w-[280px]">{profile.bio}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 px-6 pb-4">
          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border">
            <Star size={16} className="text-primary mb-1" />
            <span className="text-sm font-bold text-foreground font-mono">LVL {profile.level}</span>
            <span className="text-[10px] text-muted-foreground">Level</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border">
            <Zap size={16} className="text-accent mb-1" />
            <span className="text-sm font-bold text-foreground font-mono">{profile.streak}d</span>
            <span className="text-[10px] text-muted-foreground">Streak</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/40 border border-border">
            <Calendar size={16} className="text-muted-foreground mb-1" />
            <span className="text-sm font-bold text-foreground font-mono">{profile.joinedDate}</span>
            <span className="text-[10px] text-muted-foreground">Joined</span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-muted-foreground">XP PROGRESS</span>
            <span className="text-xs font-mono text-primary">{profile.xp}/{profile.maxXp}</span>
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

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="px-6 pb-4">
            <span className="text-xs font-mono text-muted-foreground block mb-2">BADGES</span>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Badge variant="secondary" className="gap-1 px-3 py-1 border-primary/20">
                    <span>{badge.icon}</span>
                    <span className="font-mono text-xs">{badge.label}</span>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="px-6 pb-4">
            <span className="text-xs font-mono text-muted-foreground block mb-2">INTERESTS</span>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="border-accent/30 text-accent font-mono text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="px-6 pb-6">
          <Button className="w-full bg-primary text-primary-foreground font-mono uppercase tracking-wider hover:bg-primary/90">
            <MessageCircle size={16} className="mr-2" />
            Send Message
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
