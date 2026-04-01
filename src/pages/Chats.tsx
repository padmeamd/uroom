import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MessageCircle, Users, Calendar, Briefcase } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { api } from '@/lib/api';
import { Room } from '@/types/room';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Chats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const rooms = await api.get<Room[]>(`/api/rooms/joined/${user!.id}`);
      setChats(rooms);
    } catch (error) {
      toast.error('Failed to load chats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  if (loading) {
    return (
      <AppLayout
        header={
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">Chats</h1>
          </div>
        }
      >
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground font-mono">LOADING...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Chats</h1>
          <span className="text-sm text-muted-foreground">{chats.length} chats</span>
        </div>
      }
    >
      <div className="divide-y divide-border">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chats/${chat.id}`)}
            className="px-4 py-3 flex gap-3 hover:bg-secondary/50 cursor-pointer transition-colors active:bg-vhs-green/10"
          >
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              {chat.roomType === 'PROJECT'
                ? <Briefcase size={20} className="text-uroom-purple" />
                : <Calendar size={20} className="text-primary" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-sm">
                    {chat.title}
                  </h3>
                  {chat.roomType === 'PROJECT' ? (
                    <Briefcase size={12} className="text-uroom-purple shrink-0" />
                  ) : (
                    <Calendar size={12} className="text-primary shrink-0" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(chat.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground truncate">
                  Tap to open chat
                </p>
              </div>

              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Users size={12} />
                <span>{chat.currentMembers} members</span>
              </div>
            </div>
          </div>
        ))}

        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-uroom-sky-light flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No chats yet</h3>
            <p className="text-sm text-muted-foreground">
              Join a Room to start chatting with your new group!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Chats;
