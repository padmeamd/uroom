import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Briefcase, MapPin, Users, Clock, ImagePlus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { QuizBuilder } from '@/components/room/QuizBuilder';
import { QuizQuestion } from '@/types/quiz';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

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
  const [roomType, setRoomType] = useState<RoomType>('EVENT');
  const [isUrgent, setIsUrgent] = useState(false);
  const [quizRequired, setQuizRequired] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [inactivityKick, setInactivityKick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRoomFormData>({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    maxMembers: 6,
    tags: '',
  });

  const handleChange = (field: keyof CreateRoomFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        creatorId: 'current-user-id',
        creatorName: 'Current User',
        creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
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
        maxMembers: 6,
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
        <div className="space-y-2">
          <Label>Room Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRoomType('EVENT')}
              className={`p-4 rounded-xl border-2 transition-all ${
                roomType === 'EVENT'
                  ? 'border-primary bg-uroom-sky-light'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <Calendar size={24} className={`mb-2 ${roomType === 'EVENT' ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="font-semibold text-foreground">Event</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Casual activities, meetups, hangouts
              </p>
            </button>
            <button
              onClick={() => setRoomType('PROJECT')}
              className={`p-4 rounded-xl border-2 transition-all ${
                roomType === 'PROJECT'
                  ? 'border-uroom-purple bg-uroom-purple-light'
                  : 'border-border bg-card hover:border-uroom-purple/50'
              }`}
            >
              <Briefcase size={24} className={`mb-2 ${roomType === 'PROJECT' ? 'text-uroom-purple' : 'text-muted-foreground'}`} />
              <h3 className="font-semibold text-foreground">Project</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Collaborations, films, startups
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Banner Image</Label>
          <div className="h-32 rounded-xl border-2 border-dashed border-border bg-secondary flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
            <ImagePlus size={24} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="maxMembers">Max Members</Label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="maxMembers"
              type="number"
              min={2}
              max={20}
              value={formData.maxMembers}
              className="input-focus pl-9"
              onChange={(e) => handleChange('maxMembers', parseInt(e.target.value) || 6)}
            />
          </div>
        </div>

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

        <div className="flex items-center justify-between p-4 rounded-xl bg-uroom-coral-light">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-uroom-coral" />
            <div>
              <h3 className="font-medium text-foreground">Mark as Urgent</h3>
              <p className="text-xs text-muted-foreground">Priority boost in recommendations</p>
            </div>
          </div>
          <Switch
            checked={isUrgent}
            onCheckedChange={setIsUrgent}
          />
        </div>

        {roomType === 'PROJECT' && (
          <div className="space-y-4 p-4 rounded-xl bg-uroom-purple-light">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Briefcase size={16} className="text-uroom-purple" />
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
                    <QuizBuilder
                      questions={quizQuestions}
                      onChange={setQuizQuestions}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-uroom-purple" />
                <div>
                  <p className="font-medium text-sm text-foreground">Kick Inactive Members</p>
                  <p className="text-xs text-muted-foreground">Remove if no message in 24h</p>
                </div>
              </div>
              <Switch
                checked={inactivityKick}
                onCheckedChange={setInactivityKick}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CreateRoom;
