import { AppLayout } from '@/components/layout/AppLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Briefcase, MapPin, Users, Clock, ImagePlus, Zap } from 'lucide-react';
import { toast } from 'sonner';

type RoomType = 'EVENT' | 'PROJECT';

const CreateRoom = () => {
  const [roomType, setRoomType] = useState<RoomType>('EVENT');
  const [isUrgent, setIsUrgent] = useState(false);
  const [quizRequired, setQuizRequired] = useState(false);
  const [inactivityKick, setInactivityKick] = useState(false);

  const handleCreate = () => {
    toast.success('Room created successfully! 🎉', {
      description: 'Your room is now live and visible to others.',
    });
  };

  return (
    <AppLayout
      header={
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Create Room</h1>
          <Button onClick={handleCreate} className="btn-gradient px-4 py-2 text-sm">
            Create
          </Button>
        </div>
      }
    >
      <div className="px-4 pb-8 space-y-6">
        {/* Room Type Selection */}
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

        {/* Banner Upload */}
        <div className="space-y-2">
          <Label>Banner Image</Label>
          <div className="h-32 rounded-xl border-2 border-dashed border-border bg-secondary flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
            <ImagePlus size={24} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your room an exciting name..."
            className="input-focus"
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
          />
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Where?"
                className="input-focus pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="datetime">Date & Time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              className="input-focus"
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
              defaultValue={6}
              className="input-focus pl-9"
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
          />
          <p className="text-xs text-muted-foreground">Separate with commas</p>
        </div>

        {/* Urgent Toggle */}
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

        {/* Project-specific settings */}
        {roomType === 'PROJECT' && (
          <div className="space-y-4 p-4 rounded-xl bg-uroom-purple-light">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Briefcase size={16} className="text-uroom-purple" />
              Project Settings
            </h3>
            
            {/* Quiz Required */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">Require Application</p>
                <p className="text-xs text-muted-foreground">Ask questions before joining</p>
              </div>
              <Switch
                checked={quizRequired}
                onCheckedChange={setQuizRequired}
              />
            </div>

            {/* Inactivity Kick */}
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
