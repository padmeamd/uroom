import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Camera, User, BookOpen, Plus, Loader2, Link, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { User as AppUser } from '@/types/room';

interface EditProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

function TagInput({
  label,
  tags,
  onChange,
  color = 'primary',
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  color?: 'primary' | 'accent';
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };

  const remove = (tag: string) => onChange(tags.filter(t => t !== tag));

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter..."
          className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
        />
        <Button type="button" size="icon" variant="outline" onClick={add} className="border-primary/30 shrink-0">
          <Plus size={15} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5 min-h-[24px]">
        {tags.map(tag => (
          <span
            key={tag}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono border cursor-pointer
              ${color === 'primary'
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-accent/15 border-accent/40 text-accent'}`}
          >
            {tag}
            <button onClick={() => remove(tag)} className="hover:opacity-60 ml-0.5">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function EditProfilePanel({ open, onClose }: EditProfilePanelProps) {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [age, setAge] = useState('');
  const [about, setAbout] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Populate from current user when panel opens
  useEffect(() => {
    if (open && user) {
      setName(user.name ?? '');
      setUniversity(user.university ?? '');
      setAge(user.age != null ? String(user.age) : '');
      setAbout(user.about ?? '');
      setPhotoUrl(user.photoUrl ?? '');
      setInterests([...(user.interests ?? [])]);
      setSkills([...(user.skills ?? [])]);
      setPortfolioUrl(user.portfolioUrl ?? '');
      setGithubUrl(user.githubUrl ?? '');
      setInstagramUrl(user.instagramUrl ?? '');
      setLinkedinUrl(user.linkedinUrl ?? '');
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const result = await api.upload<{ id: string; url: string }>('/api/images', file);
      setPhotoUrl(result.url);
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await api.put<AppUser>(`/api/users/${user.id}`, {
        name: name.trim(),
        university: university || null,
        age: age ? parseInt(age) : null,
        photoUrl: photoUrl || null,
        about: about || null,
        interests,
        skills,
        portfolioUrl: portfolioUrl || null,
        githubUrl: githubUrl || null,
        instagramUrl: instagramUrl || null,
        linkedinUrl: linkedinUrl || null,
      });
      await refreshUser();
      toast.success('Profile updated!');
      onClose();
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 z-50 bg-card border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-primary" />
                <span className="font-mono text-sm font-bold text-foreground tracking-wider">EDIT PROFILE</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

              {/* Photo */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Profile Photo</label>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  className="flex items-center gap-3 w-full p-3 rounded-lg border border-dashed border-primary/30 hover:border-primary/60 bg-muted/30 transition-colors"
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="" className="w-12 h-12 rounded-lg object-cover border-2 border-primary/40 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                      {photoUploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <User size={18} className="text-muted-foreground" />}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-mono text-foreground">
                      {photoUploading ? 'Uploading...' : photoUrl ? 'Click to change' : 'Click to upload'}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">JPG, PNG, WEBP — max 5MB</p>
                  </div>
                  <Camera size={14} className="ml-auto text-muted-foreground shrink-0" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Basic Info</p>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Name</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">University</label>
                  <div className="relative">
                    <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={university}
                      onChange={e => setUniversity(e.target.value)}
                      placeholder="Your university"
                      className="pl-8 bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Age</label>
                  <Input
                    type="number"
                    min={16}
                    max={99}
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">About</label>
                  <Textarea
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    maxLength={500}
                    placeholder="Tell people about yourself..."
                    className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm min-h-[80px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right font-mono">{about.length}/500</p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Interests & Skills</p>
                <TagInput label="Interests" tags={interests} onChange={setInterests} color="primary" />
                <TagInput label="Skills" tags={skills} onChange={setSkills} color="accent" />
              </div>

              {/* Links */}
              <div className="space-y-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Links</p>
                {[
                  { label: 'Portfolio', value: portfolioUrl, set: setPortfolioUrl, placeholder: 'https://yoursite.com' },
                  { label: 'GitHub', value: githubUrl, set: setGithubUrl, placeholder: 'https://github.com/...' },
                  { label: 'Instagram', value: instagramUrl, set: setInstagramUrl, placeholder: 'https://instagram.com/...' },
                  { label: 'LinkedIn', value: linkedinUrl, set: setLinkedinUrl, placeholder: 'https://linkedin.com/in/...' },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
                    <div className="relative">
                      <Link size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={value}
                        onChange={e => set(e.target.value)}
                        placeholder={placeholder}
                        className="pl-8 bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save footer */}
            <div className="px-5 py-4 border-t border-border shrink-0">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
              >
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
