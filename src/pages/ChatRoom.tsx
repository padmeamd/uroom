import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowLeft, Send, Calendar, Briefcase, Users, MoreVertical, Image, Smile } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isYesterday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface ChatRoomData {
  id: string;
  roomTitle: string;
  roomType: 'EVENT' | 'PROJECT';
  memberCount: number;
  avatars: string[];
  members: { id: string; name: string; avatar: string }[];
}

const mockChatRooms: Record<string, ChatRoomData> = {
  '1': {
    id: '1',
    roomTitle: 'Board Game Night 🎲',
    roomType: 'EVENT',
    memberCount: 4,
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50',
    ],
    members: [
      { id: 'jamie', name: 'Jamie Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50' },
      { id: 'alex', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
      { id: 'sam', name: 'Sam Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50' },
      { id: 'me', name: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50' },
    ],
  },
  '2': {
    id: '2',
    roomTitle: 'Short Film: "The Last Lecture"',
    roomType: 'PROJECT',
    memberCount: 2,
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
    ],
    members: [
      { id: 'alex', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
      { id: 'me', name: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50' },
    ],
  },
  '3': {
    id: '3',
    roomTitle: 'Photography Walk: Golden Hour',
    roomType: 'EVENT',
    memberCount: 7,
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
    ],
    members: [
      { id: 'sophie', name: 'Sophie Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50' },
      { id: 'marcus', name: 'Marcus Cole', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50' },
      { id: 'jamie', name: 'Jamie Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50' },
      { id: 'me', name: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50' },
    ],
  },
};

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      senderId: 'alex',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      text: 'Hey everyone! So excited for tonight 🎲',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isCurrentUser: false,
    },
    {
      id: '2',
      senderId: 'sam',
      senderName: 'Sam Kim',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50',
      text: 'Same here! I\'m bringing Catan and Ticket to Ride',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isCurrentUser: false,
    },
    {
      id: '3',
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
      text: 'Perfect! I\'ll bring some snacks and drinks 🍕',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isCurrentUser: true,
    },
    {
      id: '4',
      senderId: 'jamie',
      senderName: 'Jamie Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
      text: 'Can\'t wait for tonight! Who\'s bringing snacks?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isCurrentUser: false,
    },
  ],
  '2': [
    {
      id: '1',
      senderId: 'alex',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      text: 'Just finished the first draft of the script',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isCurrentUser: false,
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
      text: 'Amazing! Can you share it so I can start on the storyboard?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      isCurrentUser: true,
    },
    {
      id: '3',
      senderId: 'alex',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
      text: 'Script revisions are done. Can we meet tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isCurrentUser: false,
    },
  ],
  '3': [
    {
      id: '1',
      senderId: 'marcus',
      senderName: 'Marcus Cole',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50',
      text: 'Weather looks perfect for tomorrow! ☀️',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      isCurrentUser: false,
    },
    {
      id: '2',
      senderId: 'jamie',
      senderName: 'Jamie Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
      text: 'What lenses are you all bringing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
      isCurrentUser: false,
    },
    {
      id: '3',
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
      text: 'I\'ve got my 50mm and 85mm ready!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
      isCurrentUser: true,
    },
    {
      id: '4',
      senderId: 'sophie',
      senderName: 'Sophie Lee',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
      text: 'Here\'s the location pin 📍',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isCurrentUser: false,
    },
  ],
};

const ChatRoom = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState<ChatRoomData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatId && mockChatRooms[chatId]) {
      setRoom(mockChatRooms[chatId]);
      setMessages(mockMessages[chatId] || []);
    }
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const formatDateHeader = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
      text: newMessage.trim(),
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = format(message.timestamp, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  if (!room) {
    return (
      <AppLayout showNav={false}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground font-mono">LOADING...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      showNav={false}
      header={
        <div className="px-3 py-2 flex items-center gap-3 border-b border-vhs-green/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chats')}
            className="text-vhs-green hover:bg-vhs-green/10"
          >
            <ArrowLeft size={20} />
          </Button>
          
          {/* Room avatar stack */}
          <div className="relative w-10 h-10 shrink-0">
            {room.avatars.slice(0, 2).map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt=""
                className={`absolute w-7 h-7 rounded-full border-2 border-background object-cover ${
                  i === 0 ? 'top-0 left-0 z-20' : 'top-1 left-3 z-10'
                }`}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-foreground truncate text-sm">{room.roomTitle}</h1>
              {room.roomType === 'PROJECT' ? (
                <Briefcase size={12} className="text-vhs-purple shrink-0" />
              ) : (
                <Calendar size={12} className="text-vhs-green shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={10} />
              <span>{room.memberCount} members</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-vhs-green"
          >
            <MoreVertical size={18} />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-[calc(100vh-60px)]">
        {/* Messages area */}
        <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
          <AnimatePresence>
            {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                {/* Date divider */}
                <div className="flex items-center justify-center my-4">
                  <div className="px-3 py-1 rounded-full bg-secondary/50 border border-vhs-green/20">
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDateHeader(dateMessages[0].timestamp)}
                    </span>
                  </div>
                </div>

                {/* Messages for this date */}
                {dateMessages.map((message, index) => {
                  const showAvatar = index === 0 || 
                    dateMessages[index - 1]?.senderId !== message.senderId;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2 mb-2 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className="w-8 shrink-0">
                        {showAvatar && !message.isCurrentUser && (
                          <Avatar className="w-8 h-8 border border-vhs-green/30">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="bg-vhs-green/20 text-vhs-green text-xs">
                              {message.senderName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* Message bubble */}
                      <div className={`max-w-[75%] ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !message.isCurrentUser && (
                          <span className="text-xs text-vhs-green font-mono ml-1 mb-1 block">
                            {message.senderName}
                          </span>
                        )}
                        <div
                          className={`px-3 py-2 rounded-2xl ${
                            message.isCurrentUser
                              ? 'bg-vhs-green text-black rounded-tr-sm'
                              : 'bg-secondary/80 border border-vhs-purple/30 rounded-tl-sm'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <span className={`text-[10px] text-muted-foreground mt-1 block ${
                          message.isCurrentUser ? 'text-right mr-1' : 'ml-1'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>

                      {/* Spacer for current user messages */}
                      {message.isCurrentUser && <div className="w-8 shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-vhs-green/10 border border-vhs-green/30 flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-muted-foreground font-mono text-sm">NO MESSAGES YET</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Be the first to say hello!</p>
            </div>
          )}
        </ScrollArea>

        {/* Message input */}
        <div className="p-3 border-t border-vhs-green/20 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-vhs-purple shrink-0"
            >
              <Image size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-vhs-purple shrink-0"
            >
              <Smile size={20} />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="pr-12 bg-secondary/50 border-vhs-green/30 focus:border-vhs-green placeholder:text-muted-foreground/50"
              />
            </div>
            
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-vhs-green hover:bg-vhs-green/90 text-black shrink-0 disabled:opacity-50"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatRoom;
