import { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Briefcase, MapPin, Users, Clock, ImagePlus, Zap, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { QuizBuilder } from '@/components/room/QuizBuilder';
import { QuizQuestion } from '@/types/quiz';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type RoomType = 'EVENT' | 'PROJECT';

interface CreateRoomFormData {
  title: string;
  description: string;
  location: string;
  dateTime: string;
  maxMembers: number;
  tags: string;
  bannerUrl?: string;
}

const CreateRoom = () => {
  const { user } = useAuth();
  const [roomType, setRoomType] = useState<RoomType>('EVENT');
  const [isUrgent, setIsUrgent] = useState(false);
  const [quizRequired, setQuizRequired] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [inactivityKick, setInactivityKick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CreateRoomFormData>({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    maxMembers: undefined as unknown as number,
    tags: '',
  });

  const handleChange = (field: keyof CreateRoomFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const result = await api.upload<{ id: string; url: string }>('/api/images', file);
      setFormData(prev => ({ ...prev, bannerUrl: result.url }));
    } catch {
      toast.error('Failed to upload banner image');
    } finally {
      setBannerUploading(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      const roomData = {
        title: formData.title,
        roomType,
        bannerUrl: formData.bannerUrl,
        description: formData.description,
        location: formData.location,
        dateTime: formData.dateTime ? new Date(formData.dateTime).toISOString() : null,
        maxMembers: formData.maxMembers,
        tags,
        isUrgent,
        quizRequired,
        autoAccept: roomType === 'EVENT',
        inactivityTimeoutHours: inactivityKick ? 24 : null,
        creatorId: user!.id,
        creatorName: user!.name,
        creatorAvatar: user!.photoUrl || null,
      };

      const room = await api.post<{ id: string }>('/api/rooms', roomData);

      if (quizRequired && quizQuestions.length > 0) {
        for (const q of quizQuestions) {
          await api.post('/api/rooms/' + room.id + '/quiz-questions', {
            questionType: q.type,
            question: q.question,
            options: q.options,
            required: q.required,
            orderIndex: q.orderIndex,
          });
        }
      }

      toast.success('Room created successfully! 🎉', {
        description: 'Your room is now live and visible to others.',
      });

      setFormData({
        title: '',
        description: '',
        location: '',
        dateTime: '',
        maxMembers: undefined as unknown as number,
        tags: '',
      });
      setQuizQuestions([]);
      setIsUrgent(false);
      setQuizRequired(false);
      setInactivityKick(false);
    } catch (error) {
      toast.error('Failed to create room');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      header={
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Create Room</h1>
          <Button
            onClick={handleCreate}
            className="btn-gradient px-4 py-2 text-sm"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="px-4 pb-8 space-y-6">
        {/* Room Type */}
        <div className="space-y-2">
          <Label>Room Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRoomType('EVENT')}
              className={`p-4 rounded-xl border-2 transition-all ${
                roomType === 'EVENT'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <Calendar size={24} className={`mb-2 ${roomType === 'EVENT' ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="font-semibold text-foreground">Event</h3>
              <p className="text-xs text-muted-foreground mt-1">Casual activities, meetups, hangouts</p>
            </button>
            <button
              onClick={() => setRoomType('PROJECT')}
              className={`p-4 rounded-xl border-2 transition-all ${
                roomType === 'PROJECT'
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-card hover:border-accent/50'
              }`}
            >
              <Briefcase size={24} className={`mb-2 ${roomType === 'PROJECT' ? 'text-accent' : 'text-muted-foreground'}`} />
              <h3 className="font-semibold text-foreground">Project</h3>
              <p className="text-xs text-muted-foreground mt-1">Collaborations, films, startups</p>
            </button>
          </div>
        </div>

        {/* Banner Image */}
        <div className="space-y-2">
          <Label>Banner Image</Label>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerSelect}
          />
          {formData.bannerUrl ? (
            <div className="relative h-32 rounded-xl overflow-hidden border border-border">
              <img
                src={formData.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-black text-xs font-mono font-bold"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, bannerUrl: undefined }))}
                  className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center"
                >
                  <X size={14} className="text-black" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              disabled={bannerUploading}
              className="w-full h-32 rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              {bannerUploading ? (
                <Loader2 size={24} className="text-muted-foreground animate-spin" />
              ) : (
                <ImagePlus size={24} className="text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground font-mono">
                {bannerUploading ? 'UPLOADING...' : 'CLICK TO UPLOAD'}
              </span>
              <span className="text-xs text-muted-foreground/60 font-mono">JPG, PNG, WEBP — max 5 MB</span>
            </button>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your room an exciting name..."
            className="input-focus"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What's this room about? (max 200 chars)"
            maxLength={200}
            className="input-focus min-h-[80px]"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Location + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Where?"
                className="input-focus pl-9"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="datetime">Date & Time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              className="input-focus"
              value={formData.dateTime}
              onChange={(e) => handleChange('dateTime', e.target.value)}
            />
          </div>
        </div>

        {/* Max Members */}
        <div className="space-y-2">
          <Label htmlFor="maxMembers">Max Members</Label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="maxMembers"
              type="number"
              min={2}
              max={20}
              value={formData.maxMembers ?? ''}
              className="input-focus pl-9"
              onChange={(e) => handleChange('maxMembers', e.target.value === '' ? undefined as unknown as number : parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Film, Photography, Startup..."
            className="input-focus"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Separate with commas</p>
        </div>

        {/* Urgent toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-destructive" />
            <div>
              <h3 className="font-medium text-foreground">Mark as Urgent</h3>
              <p className="text-xs text-muted-foreground">Priority boost in recommendations</p>
            </div>
          </div>
          <Switch checked={isUrgent} onCheckedChange={setIsUrgent} />
        </div>

        {/* Project settings */}
        {roomType === 'PROJECT' && (
          <div className="space-y-4 p-4 rounded-xl bg-accent/10">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Briefcase size={16} className="text-accent" />
              Project Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Require Application</p>
                  <p className="text-xs text-muted-foreground">Ask questions before joining</p>
                </div>
                <Switch
                  checked={quizRequired}
                  onCheckedChange={(checked) => {
                    setQuizRequired(checked);
                    if (checked && quizQuestions.length === 0) {
                      setQuizQuestions([{
                        id: crypto.randomUUID(),
                        type: 'text',
                        question: 'Why do you want to join this project?',
                        required: true,
                      }]);
                    }
                  }}
                />
              </div>

              <AnimatePresence>
                {quizRequired && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuizBuilder questions={quizQuestions} onChange={setQuizQuestions} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-accent" />
                <div>
                  <p className="font-medium text-sm text-foreground">Kick Inactive Members</p>
                  <p className="text-xs text-muted-foreground">Remove if no message in 24h</p>
                </div>
              </div>
              <Switch checked={inactivityKick} onCheckedChange={setInactivityKick} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CreateRoom;
