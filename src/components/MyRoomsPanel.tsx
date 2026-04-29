import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Room } from '@/types/room';
import { CheckCheck, X, Users, Edit, Trash2, ChevronDown, ChevronRight, Star, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface PendingMember {
  userId: string;
  name: string;
  photoUrl?: string;
  university?: string;
  age?: number;
  about?: string;
  interests: string[];
  skills: string[];
  level: number;
  xp: number;
  streak: number;
  role?: string;
  status: string;
  joinedAt: string;
}

interface MyRoomsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function MyRoomsPanel({ open, onClose }: MyRoomsPanelProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pendingMap, setPendingMap] = useState<Record<string, PendingMember[]>>({});
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      fetchMyRooms();
    }
  }, [open, user]);

  const fetchMyRooms = async () => {
    setLoading(true);
    try {
      const data = await api.get<Room[]>(`/api/rooms/user/${user!.id}`);
      setRooms(data);
    } catch {
      toast.error('Failed to load your rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async (roomId: string) => {
    if (pendingMap[roomId] !== undefined) {
      setExpandedRoom(prev => prev === roomId ? null : roomId);
      return;
    }
    try {
      const data = await api.get<PendingMember[]>(`/api/rooms/${roomId}/members/pending`);
      setPendingMap(prev => ({ ...prev, [roomId]: data }));
      setExpandedRoom(roomId);
    } catch {
      toast.error('Failed to load applicants');
    }
  };

  const handleAccept = async (roomId: string, applicantId: string) => {
    setActionLoading(`${roomId}-${applicantId}-accept`);
    try {
      await api.post(`/api/rooms/${roomId}/members/${applicantId}/accept`, {});
      setPendingMap(prev => ({
        ...prev,
        [roomId]: prev[roomId].filter(m => m.userId !== applicantId),
      }));
      toast.success('Member accepted!');
    } catch {
      toast.error('Failed to accept member');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (roomId: string, applicantId: string) => {
    setActionLoading(`${roomId}-${applicantId}-reject`);
    try {
      await api.post(`/api/rooms/${roomId}/members/${applicantId}/reject`, {});
      setPendingMap(prev => ({
        ...prev,
        [roomId]: prev[roomId].filter(m => m.userId !== applicantId),
      }));
      toast.info('Request declined');
    } catch {
      toast.error('Failed to reject member');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Delete this room? This cannot be undone.')) return;
    try {
      await api.delete(`/api/rooms/${roomId}`);
      setRooms(prev => prev.filter(r => r.id !== roomId));
      toast.success('Room deleted');
    } catch {
      toast.error('Failed to delete room');
    }
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto p-0">
        <SheetHeader className="px-4 py-4 border-b border-border/50">
          <SheetTitle className="font-mono font-bold text-foreground flex items-center gap-2">
            <span className="text-primary">◈</span> MY ROOMS
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {loading && (
            <p className="text-center text-muted-foreground font-mono text-sm py-8">LOADING...</p>
          )}

          {!loading && rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-mono text-sm">NO ROOMS YET</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first room to get started</p>
            </div>
          )}

          {rooms.map(room => {
            const pending = pendingMap[room.id] ?? [];
            const isExpanded = expandedRoom === room.id;

            return (
              <div key={room.id} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Room header */}
                <div className="p-3 flex flex-col gap-2">
                  {room.bannerUrl && (
                    <div className="h-24 rounded-lg overflow-hidden">
                      <img src={room.bannerUrl} alt={room.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{room.title}</h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground font-mono">
                        <span className={`uppercase px-1.5 py-0.5 rounded text-[10px] ${room.roomType === 'EVENT' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                          {room.roomType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={10} />
                          {room.currentMembers}/{room.maxMembers}
                        </span>
                        {room.dateTime && (
                          <span>{format(new Date(room.dateTime), 'MMM d, h:mm a')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => { onClose(); navigate(`/create-room?edit=${room.id}`); }}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit room"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete room"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Pending applicants toggle */}
                  {room.quizRequired && (
                    <button
                      onClick={() => fetchPending(room.id)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-accent/10 text-accent text-sm font-mono hover:bg-accent/20 transition-colors"
                    >
                      <span>
                        {pendingMap[room.id] !== undefined
                          ? `${pendingMap[room.id].length} APPLICANT${pendingMap[room.id].length !== 1 ? 'S' : ''}`
                          : 'VIEW APPLICANTS'}
                      </span>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )}
                </div>

                {/* Pending members list */}
                {isExpanded && (
                  <div className="border-t border-border/50">
                    {pending.length === 0 ? (
                      <p className="text-center text-muted-foreground text-xs font-mono py-4">
                        NO PENDING REQUESTS
                      </p>
                    ) : (
                      <div className="divide-y divide-border/30">
                        {pending.map(member => (
                          <div key={member.userId} className="p-3 space-y-2">
                            {/* Applicant profile */}
                            <div className="flex items-start gap-3">
                              {member.photoUrl ? (
                                <img
                                  src={member.photoUrl}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/30 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                  <span className="text-primary font-bold text-sm">
                                    {member.name?.[0]?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-foreground text-sm">{member.name}</span>
                                  {member.university && (
                                    <span className="text-xs text-muted-foreground font-mono truncate">
                                      {member.university}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground font-mono">
                                  <span className="flex items-center gap-1">
                                    <Star size={9} className="text-accent" />
                                    LVL {member.level}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Zap size={9} className="text-primary" />
                                    {member.streak}d streak
                                  </span>
                                </div>
                                {member.about && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{member.about}</p>
                                )}
                              </div>
                            </div>

                            {/* Skills */}
                            {member.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {member.skills.slice(0, 5).map((s, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 text-secondary-foreground font-mono border border-primary/20"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Accept / Reject */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 h-8 text-xs btn-gradient"
                                disabled={actionLoading !== null}
                                onClick={() => handleAccept(room.id, member.userId)}
                              >
                                {actionLoading === `${room.id}-${member.userId}-accept` ? '...' : (
                                  <><CheckCheck size={13} className="mr-1" /> ACCEPT</>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-8 text-xs border-destructive/50 text-destructive hover:bg-destructive/10"
                                disabled={actionLoading !== null}
                                onClick={() => handleReject(room.id, member.userId)}
                              >
                                {actionLoading === `${room.id}-${member.userId}-reject` ? '...' : (
                                  <><X size={13} className="mr-1" /> DECLINE</>
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
