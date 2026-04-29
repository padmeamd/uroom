import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Briefcase, MapPin, Users, Clock, Check, X, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Room, MemberWithProfile } from '@/types/room';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MemberProfileSheet } from './MemberProfileSheet';

interface RoomInfoSheetProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export const RoomInfoSheet = ({ room, open, onOpenChange, currentUserId }: RoomInfoSheetProps) => {
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [pending, setPending] = useState<MemberWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const isCreator = room?.creatorId === currentUserId;

  useEffect(() => {
    if (room && open) {
      setLoading(true);
      const promises: Promise<void>[] = [
        api.get<MemberWithProfile[]>(`/api/rooms/${room.id}/members/profiles`)
          .then(setMembers)
          .catch(console.error),
      ];
      if (isCreator) {
        promises.push(
          api.get<MemberWithProfile[]>(`/api/rooms/${room.id}/pending`)
            .then(setPending)
            .catch(console.error)
        );
      }
      Promise.all(promises).finally(() => setLoading(false));
    }
  }, [room, open]);

  const handleAccept = async (userId: string) => {
    if (!room) return;
    try {
      await api.post(`/api/rooms/${room.id}/members/${userId}/accept`, {});
      setPending(prev => prev.filter(m => m.userId !== userId));
      toast.success('Member accepted');
      // Refresh members list
      const updated = await api.get<MemberWithProfile[]>(`/api/rooms/${room.id}/members/profiles`);
      setMembers(updated);
    } catch {
      toast.error('Failed to accept member');
    }
  };

  const handleReject = async (userId: string) => {
    if (!room) return;
    try {
      await api.post(`/api/rooms/${room.id}/members/${userId}/reject`, {});
      setPending(prev => prev.filter(m => m.userId !== userId));
      toast.success('Request rejected');
    } catch {
      toast.error('Failed to reject request');
    }
  };

  const openProfile = (userId: string) => {
    setSelectedUserId(userId);
    setProfileOpen(true);
  };

  if (!room) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl border-t border-primary/30 bg-card max-h-[90vh] overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Room Info</SheetTitle>
          </SheetHeader>

          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Room banner */}
          {room.bannerUrl && (
            <div className="mx-4 mb-3 rounded-xl overflow-hidden h-24">
              <img src={room.bannerUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Room header */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              {room.roomType === 'PROJECT'
                ? <Briefcase size={16} className="text-uroom-purple shrink-0" />
                : <Calendar size={16} className="text-primary shrink-0" />}
              <h2 className="text-base font-bold text-foreground font-mono leading-tight">{room.title}</h2>
            </div>
            {room.description && (
              <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
            )}
          </div>

          {/* Room meta */}
          <div className="px-5 pb-4 flex flex-wrap gap-3">
            {room.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={13} className="text-primary" />
                <span>{room.location}</span>
              </div>
            )}
            {room.dateTime && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={13} className="text-primary" />
                <span>{format(new Date(room.dateTime), 'MMM d, yyyy · h:mm a')}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users size={13} className="text-primary" />
              <span>{room.currentMembers}/{room.maxMembers} members</span>
            </div>
          </div>

          {/* Tags */}
          {room.tags && room.tags.length > 0 && (
            <div className="px-5 pb-4 flex flex-wrap gap-2">
              {room.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Creator */}
          {(room.creatorName || room.creatorAvatar) && (
            <>
              <div className="border-t border-border mx-4 mb-3" />
              <div className="px-5 pb-4">
                <span className="text-xs font-mono text-muted-foreground block mb-3">
                  CREATED BY
                </span>
                <div
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => room.creatorId && openProfile(room.creatorId)}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-primary/50 shrink-0">
                      <AvatarImage src={room.creatorAvatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-mono">
                        {room.creatorName?.charAt(0) ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-card border border-primary/30 flex items-center justify-center">
                      <Crown size={9} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{room.creatorName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      @{room.creatorName?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown'}
                    </p>
                  </div>
                  <Badge className="text-[10px] font-mono bg-primary/20 text-primary border border-primary/30 shrink-0">
                    CREATOR
                  </Badge>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-border mx-4 mb-3" />

          {/* Members */}
          <div className="px-5 pb-3">
            <span className="text-xs font-mono text-muted-foreground block mb-3">
              MEMBERS ({members.length})
            </span>
            {loading ? (
              <p className="text-xs text-muted-foreground font-mono">LOADING...</p>
            ) : (
              <div className="space-y-2">
                {members.map((member, i) => (
                  <motion.div
                    key={member.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => openProfile(member.userId)}
                  >
                    <Avatar className="w-9 h-9 border border-primary/30 shrink-0">
                      <AvatarImage src={member.photoUrl} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-mono">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                      {member.university && (
                        <p className="text-xs text-muted-foreground truncate">{member.university}</p>
                      )}
                    </div>
                    {member.role && (
                      <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                        {member.role}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pending requests — creator only */}
          {isCreator && pending.length > 0 && (
            <>
              <div className="border-t border-border mx-4 mb-3" />
              <div className="px-5 pb-5">
                <span className="text-xs font-mono text-muted-foreground block mb-3">
                  PENDING REQUESTS ({pending.length})
                </span>
                <div className="space-y-2">
                  {pending.map((member, i) => (
                    <motion.div
                      key={member.userId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-secondary/30 border border-border"
                    >
                      <Avatar
                        className="w-9 h-9 border border-primary/30 shrink-0 cursor-pointer"
                        onClick={() => openProfile(member.userId)}
                      >
                        <AvatarImage src={member.photoUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-mono">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => openProfile(member.userId)}
                      >
                        <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                        {member.university && (
                          <p className="text-xs text-muted-foreground truncate">{member.university}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleAccept(member.userId)}
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(member.userId)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <MemberProfileSheet
        userId={selectedUserId}
        open={profileOpen}
        onOpenChange={(open) => { setProfileOpen(open); if (!open) setSelectedUserId(null); }}
      />
    </>
  );
};
