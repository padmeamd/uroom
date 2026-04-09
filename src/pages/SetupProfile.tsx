import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, User, BookOpen, Heart, Zap, Link, ArrowRight, Loader2, Plus, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STEP_LABELS = ['Basic Info', 'Interests & Skills', 'Links'];

const SetupProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [university, setUniversity] = useState('');
  const [age, setAge] = useState('');
  const [about, setAbout] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

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

  const addTag = (value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter(t => t !== tag));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(value, list, setList, setInput);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.put(`/api/users/${user.id}`, {
        name: user.name,
        university: university || null,
        age: age ? parseInt(age) : null,
        photoUrl: photoUrl || null,
        interests,
        skills,
        about: about || null,
        portfolioUrl: portfolioUrl || null,
        instagramUrl: instagramUrl || null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
      });
      toast.success('Profile saved!');
      navigate('/');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate('/');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 border-2 border-primary mb-3">
            <Radio size={28} className="text-primary animate-neon" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground glitch-text">SET UP PROFILE</h1>
          <p className="text-muted-foreground font-mono text-xs mt-1">
            STEP {step + 1} OF {STEP_LABELS.length} — {STEP_LABELS[step].toUpperCase()}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6">
          {STEP_LABELS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <div className="card-elevated p-6 space-y-4">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Profile Photo</label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  className="flex items-center gap-3 w-full p-3 rounded-lg border border-dashed border-primary/30 hover:border-primary/60 bg-muted/50 transition-colors"
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                      {photoUploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <User size={18} className="text-muted-foreground" />}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-mono text-foreground">
                      {photoUploading ? 'Uploading...' : photoUrl ? 'Click to change' : 'Click to upload'}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">JPG, PNG, WEBP — max 5MB</p>
                  </div>
                  <Camera size={16} className="ml-auto text-muted-foreground shrink-0" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">University</label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Your university"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    className="pl-9 bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Age</label>
                <Input
                  type="number"
                  placeholder="Your age"
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
                  placeholder="Tell people about yourself..."
                  maxLength={500}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm min-h-[80px] resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{about.length}/500</p>
              </div>
            </motion.div>
          )}

          {/* Step 1: Interests & Skills */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Heart size={12} className="text-primary" /> Interests
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Film, Coding, Music..."
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                    onKeyDown={e => handleTagKeyDown(e, interestInput, interests, setInterests, setInterestInput)}
                    className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => addTag(interestInput, interests, setInterests, setInterestInput)}
                    className="border-primary/30 shrink-0"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[28px]">
                  {interests.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-mono text-primary">
                      {tag}
                      <button onClick={() => removeTag(tag, interests, setInterests)} className="hover:text-destructive">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Zap size={12} className="text-accent" /> Skills
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="React, Design, Marketing..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => handleTagKeyDown(e, skillInput, skills, setSkills, setSkillInput)}
                    className="bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => addTag(skillInput, skills, setSkills, setSkillInput)}
                    className="border-primary/30 shrink-0"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[28px]">
                  {skills.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-mono text-accent">
                      {tag}
                      <button onClick={() => removeTag(tag, skills, setSkills)} className="hover:text-destructive">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Press Enter or comma to add a tag</p>
            </motion.div>
          )}

          {/* Step 2: Links */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <p className="text-xs text-muted-foreground font-mono">All links are optional</p>
              {[
                { label: 'Portfolio', value: portfolioUrl, set: setPortfolioUrl, placeholder: 'https://yoursite.com' },
                { label: 'GitHub', value: githubUrl, set: setGithubUrl, placeholder: 'https://github.com/username' },
                { label: 'Instagram', value: instagramUrl, set: setInstagramUrl, placeholder: 'https://instagram.com/username' },
                { label: 'LinkedIn', value: linkedinUrl, set: setLinkedinUrl, placeholder: 'https://linkedin.com/in/username' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label} className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
                  <div className="relative">
                    <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={placeholder}
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="pl-8 bg-muted/50 border-primary/30 focus:border-primary font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(s => s - 1)}
                className="flex-1 border-primary/30 font-mono"
              >
                BACK
              </Button>
            )}
            {step < STEP_LABELS.length - 1 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-primary text-primary-foreground font-mono"
              >
                NEXT <ArrowRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground font-mono"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>COMPLETE <ArrowRight size={16} className="ml-1" /></>}
              </Button>
            )}
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="w-full text-center text-xs text-muted-foreground font-mono mt-4 hover:text-foreground transition-colors"
        >
          SKIP FOR NOW →
        </button>
      </motion.div>
    </div>
  );
};

export default SetupProfile;
