import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MessageCircle, Users, Calendar, Briefcase } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface Chat {
  id: string;
  roomTitle: string;
  roomType: 'EVENT' | 'PROJECT';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  memberCount: number;
  avatars: string[];
}

const mockChats: Chat[] = [
  {
    id: '1',
    roomTitle: 'Board Game Night 🎲',
    roomType: 'EVENT',
    lastMessage: 'Jamie: Can\'t wait for tonight! Who\'s bringing snacks?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 3,
    memberCount: 4,
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50',
    ],
  },
  {
    id: '2',
    roomTitle: 'Short Film: "The Last Lecture"',
    roomType: 'PROJECT',
    lastMessage: 'Alex: Script revisions are done. Can we meet tomorrow?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    memberCount: 2,
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
    ],
  },
  {
    id: '3',
    roomTitle: 'Photography Walk: Golden Hour',
    roomType: 'EVENT',
    lastMessage: 'Sophie: Here\'s the location pin 📍',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 1,
    memberCount: 7,
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
    ],
  },
];

const Chats = () => {
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <AppLayout
      header={
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Chats</h1>
          <span className="text-sm text-muted-foreground">{mockChats.length} rooms</span>
        </div>
      }
    >
      <div className="divide-y divide-border">
        {mockChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chats/${chat.id}`)}
            className="px-4 py-3 flex gap-3 hover:bg-secondary/50 cursor-pointer transition-colors active:bg-vhs-green/10"
          >
            {/* Avatar stack */}
            <div className="relative w-12 h-12 shrink-0">
              {chat.avatars.slice(0, 3).map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt=""
                  className={`absolute w-8 h-8 rounded-full border-2 border-background object-cover ${
                    i === 0 ? 'top-0 left-0 z-30' :
                    i === 1 ? 'top-1 left-3 z-20' :
                    'top-2 left-1 z-10'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
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
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Users size={12} />
                <span>{chat.memberCount} members</span>
              </div>
            </div>
          </div>
        ))}

        {mockChats.length === 0 && (
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
