import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MessageCircle, Users, Calendar, Briefcase } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { api } from '@/lib/api';
import { ChatRoom } from '@/types/room';
import { toast } from 'sonner';

const Chats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const rooms = await api.get<ChatRoom[]>('/api/rooms');
      const roomsWithChats = rooms.filter(r => r.currentMembers > 0);
      setChats(roomsWithChats);
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
          <span className="text-sm text-muted-foreground">{chats.length} rooms</span>
        </div>
      }
    >
      <div className="divide-y divide-border">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chats/${chat.roomId}`)}
            className="px-4 py-3 flex gap-3 hover:bg-secondary/50 cursor-pointer transition-colors active:bg-vhs-green/10"
          >
            <div className="relative w-12 h-12 shrink-0">
              {chat.memberAvatars.slice(0, 3).map((avatar, i) => (
                <img
                  key={i}
                  src={avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50'}
                  alt=""
                  className={`absolute w-8 h-8 rounded-full border-2 border-background object-cover ${
                    i === 0 ? 'top-0 left-0 z-30' :
                    i === 1 ? 'top-1 left-3 z-20' :
                    'top-2 left-1 z-10'
                  }`}
                />
              ))}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-sm">
                    {chat.roomTitle}
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
                  Click to view chat
                </p>
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Users size={12} />
                <span>{chat.memberCount} members</span>
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
