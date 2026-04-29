import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowLeft, Send, Calendar, Briefcase, Users, MoreVertical, Image, Paperclip, X, FileText, Download, Loader2, MapPin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, isYesterday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MemberProfileSheet } from '@/components/room/MemberProfileSheet';
import { LocationPicker, type LocationData } from '@/components/room/LocationPicker';
import { api } from '@/lib/api';
import { ChatRoom as ChatRoomData, Message } from '@/types/room';
import { useAuth } from '@/contexts/AuthContext';

interface Attachment {
  id: string;
  url: string;
  name: string;
  type: 'IMAGE' | 'FILE';
  mimeType: string;
  size: number;
}

interface PendingFile {
  file: File;
  preview?: string;
  type: 'image' | 'file';
}

const ChatRoomPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState<ChatRoomData | null>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId]);

  const fetchChatData = async () => {
    if (!chatId) return;
    
    setLoading(true);
    try {
      const chatRoom = await api.get<ChatRoomData>(`/api/chats/room/${chatId}?currentUserId=${user!.id}`);
      setRoom(chatRoom);

      const chatMessages = await api.get<Message[]>(`/api/chats/${chatRoom.id}/messages?currentUserId=${user!.id}`);
      setMessages(chatMessages);
    } catch (error) {
      toast.error('Failed to load chat');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessageTime = (dateStr: string) => {
    return format(new Date(dateStr), 'h:mm a');
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() && pendingFiles.length === 0) return;
    if (!room) return;

    setIsUploading(true);

    try {
      const request = {
        text: newMessage.trim(),
        location: undefined,
      };

      const senderAvatar = encodeURIComponent(user!.photoUrl || '');
      const senderName = encodeURIComponent(user!.name);
      const message = await api.post<Message>(
        `/api/chats/${room.id}/messages?senderId=${user!.id}&senderName=${senderName}&senderAvatar=${senderAvatar}`,
        request
      );

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setPendingFiles([]);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendLocation = async (location: LocationData) => {
    if (!room) return;

    try {
      const request = {
        text: '',
        location,
      };

      const senderAvatar = encodeURIComponent(user!.photoUrl || '');
      const senderName = encodeURIComponent(user!.name);
      const message = await api.post<Message>(
        `/api/chats/${room.id}/messages?senderId=${user!.id}&senderName=${senderName}&senderAvatar=${senderAvatar}`,
        request
      );

      setMessages(prev => [...prev, message]);
      toast.success('Location shared!');
    } catch (error) {
      toast.error('Failed to share location');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = format(new Date(message.createdAt), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  if (loading) {
    return (
      <AppLayout showNav={false}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground font-mono">LOADING...</p>
        </div>
      </AppLayout>
    );
  }

  if (!room) {
    return (
      <AppLayout showNav={false}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground font-mono">CHAT NOT FOUND</p>
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
            {room.memberAvatars.slice(0, 2).map((avatar, i) => (
              <img
                key={i}
                src={avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50'}
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
        <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
          <AnimatePresence>
            {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                <div className="flex items-center justify-center my-4">
                  <div className="px-3 py-1 rounded-full bg-secondary/50 border border-vhs-green/20">
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDateHeader(dateMessages[0].createdAt)}
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
                            onClick={() => setSelectedMember(message.senderId)}
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
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className={`flex flex-wrap gap-2 mb-1 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {message.attachments.map((attachment) => (
                              attachment.type === 'IMAGE' ? (
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

                        {message.location && (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${message.location.lat}&mlon=${message.location.lng}#map=15/${message.location.lat}/${message.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block rounded-xl overflow-hidden border transition-all hover:scale-[1.02] mb-1 ${
                              message.isCurrentUser
                                ? 'border-vhs-green/30'
                                : 'border-vhs-purple/30'
                            }`}
                            style={{ maxWidth: 240 }}
                          >
                            <iframe
                              title="Location"
                              width="240"
                              height="130"
                              style={{ border: 0, pointerEvents: 'none' }}
                              loading="lazy"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${message.location.lng - 0.015},${message.location.lat - 0.008},${message.location.lng + 0.015},${message.location.lat + 0.008}&layer=mapnik&marker=${message.location.lat},${message.location.lng}`}
                            />
                            <div className={`flex items-center gap-2 px-3 py-2 ${
                              message.isCurrentUser ? 'bg-vhs-green/20' : 'bg-secondary/50'
                            }`}>
                              <MapPin size={14} className="text-primary shrink-0" />
                              <span className="text-xs font-mono truncate">{message.location.label}</span>
                            </div>
                          </a>
                        )}

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
                          {formatMessageTime(message.createdAt)}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocationPickerOpen(true)}
              className="text-muted-foreground hover:text-primary shrink-0"
              disabled={isUploading}
            >
              <MapPin size={20} />
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

      <MemberProfileSheet
        userId={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />

      <LocationPicker
        open={locationPickerOpen}
        onOpenChange={setLocationPickerOpen}
        onSendLocation={handleSendLocation}
      />

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

export default ChatRoomPage;
