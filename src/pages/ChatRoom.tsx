import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowLeft, Send, Calendar, Briefcase, Users, MoreVertical, Image, Smile, Paperclip, X, FileText, Download, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isYesterday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MemberProfileSheet } from '@/components/room/MemberProfileSheet';

interface Attachment {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'file';
  mimeType: string;
  size: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: Date;
  isCurrentUser: boolean;
  attachments?: Attachment[];
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

interface PendingFile {
  file: File;
  preview?: string;
  type: 'image' | 'file';
}

const ChatRoom = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState<ChatRoomData | null>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string; avatar: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatId && mockChatRooms[chatId]) {
      setRoom(mockChatRooms[chatId]);
      setMessages(mockMessages[chatId] || []);
    }
  }, [chatId]);

  useEffect(() => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImageFile = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = e.target.files;
    if (!files) return;

    const newPending: PendingFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }

      const pendingFile: PendingFile = {
        file,
        type: isImageFile(file.type) ? 'image' : 'file',
      };

      if (isImageFile(file.type)) {
        pendingFile.preview = URL.createObjectURL(file);
      }

      newPending.push(pendingFile);
    });

    setPendingFiles(prev => [...prev, ...newPending]);
    e.target.value = '';
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async (): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];

    for (const pending of pendingFiles) {
      const fileExt = pending.file.name.split('.').pop();
      const fileName = `${chatId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, pending.file);

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${pending.file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(data.path);

      attachments.push({
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        url: urlData.publicUrl,
        name: pending.file.name,
        type: pending.type,
        mimeType: pending.file.type,
        size: pending.file.size,
      });
    }

    return attachments;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      let attachments: Attachment[] = [];
      
      if (pendingFiles.length > 0) {
        attachments = await uploadFiles();
        // Clean up previews
        pendingFiles.forEach(p => {
          if (p.preview) URL.revokeObjectURL(p.preview);
        });
        setPendingFiles([]);
      }

      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
        text: newMessage.trim(),
        timestamp: new Date(),
        isCurrentUser: true,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      inputRef.current?.focus();
      
      if (attachments.length > 0) {
        toast.success(`Sent ${attachments.length} file${attachments.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
                <div className="flex items-center justify-center my-4">
                  <div className="px-3 py-1 rounded-full bg-secondary/50 border border-vhs-green/20">
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDateHeader(dateMessages[0].timestamp)}
                    </span>
                  </div>
                </div>

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
                      <div className="w-8 shrink-0">
                        {showAvatar && !message.isCurrentUser && (
                          <Avatar
                            className="w-8 h-8 border border-vhs-green/30 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                            onClick={() => setSelectedMember({
                              id: message.senderId,
                              name: message.senderName,
                              avatar: message.senderAvatar,
                            })}
                          >
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="bg-vhs-green/20 text-vhs-green text-xs">
                              {message.senderName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <div className={`max-w-[75%] ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !message.isCurrentUser && (
                          <span className="text-xs text-vhs-green font-mono ml-1 mb-1 block">
                            {message.senderName}
                          </span>
                        )}
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className={`flex flex-wrap gap-2 mb-1 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {message.attachments.map((attachment) => (
                              attachment.type === 'image' ? (
                                <motion.div
                                  key={attachment.id}
                                  whileHover={{ scale: 1.02 }}
                                  className="relative cursor-pointer"
                                  onClick={() => setSelectedImage(attachment.url)}
                                >
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="max-w-[200px] max-h-[200px] rounded-lg border border-vhs-purple/30 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                    <span className="text-[10px] text-white font-mono truncate max-w-[180px] px-2">
                                      {attachment.name}
                                    </span>
                                  </div>
                                </motion.div>
                              ) : (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                    message.isCurrentUser 
                                      ? 'bg-vhs-green/20 border-vhs-green/30 hover:bg-vhs-green/30' 
                                      : 'bg-secondary/50 border-vhs-purple/30 hover:bg-secondary'
                                  }`}
                                >
                                  <FileText size={16} className="text-vhs-purple shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium truncate max-w-[150px]">{attachment.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{formatFileSize(attachment.size)}</p>
                                  </div>
                                  <Download size={14} className="text-muted-foreground shrink-0" />
                                </a>
                              )
                            ))}
                          </div>
                        )}

                        {/* Text bubble */}
                        {message.text && (
                          <div
                            className={`px-3 py-2 rounded-2xl ${
                              message.isCurrentUser
                                ? 'bg-vhs-green text-black rounded-tr-sm'
                                : 'bg-secondary/80 border border-vhs-purple/30 rounded-tl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                        )}
                        <span className={`text-[10px] text-muted-foreground mt-1 block ${
                          message.isCurrentUser ? 'text-right mr-1' : 'ml-1'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>

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

        {/* Pending files preview */}
        <AnimatePresence>
          {pendingFiles.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-vhs-green/20 bg-secondary/30 overflow-hidden"
            >
              <div className="p-3 flex gap-2 overflow-x-auto">
                {pendingFiles.map((pending, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative shrink-0"
                  >
                    {pending.type === 'image' && pending.preview ? (
                      <div className="relative">
                        <img
                          src={pending.preview}
                          alt={pending.file.name}
                          className="w-16 h-16 rounded-lg object-cover border border-vhs-purple/30"
                        />
                        <button
                          onClick={() => removePendingFile(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-vhs-purple/30">
                        <FileText size={16} className="text-vhs-purple" />
                        <div className="max-w-[100px]">
                          <p className="text-xs truncate">{pending.file.name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatFileSize(pending.file.size)}</p>
                        </div>
                        <button
                          onClick={() => removePendingFile(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message input */}
        <div className="p-3 border-t border-vhs-green/20 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'image')}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'file')}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              className="text-muted-foreground hover:text-vhs-purple shrink-0"
              disabled={isUploading}
            >
              <Image size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-vhs-purple shrink-0"
              disabled={isUploading}
            >
              <Paperclip size={20} />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="pr-12 bg-secondary/50 border-vhs-green/30 focus:border-vhs-green placeholder:text-muted-foreground/50"
                disabled={isUploading}
              />
            </div>
            
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && pendingFiles.length === 0) || isUploading}
              className="bg-vhs-green hover:bg-vhs-green/90 text-black shrink-0 disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Member profile sheet */}
      <MemberProfileSheet
        member={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />

      {/* Image lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/10"
            >
              <X size={24} />
            </Button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default ChatRoom;
