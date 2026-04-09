import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Room } from '@/types/room';
import { toast } from 'sonner';
import {
  Settings,
  Edit2,
  MapPin,
  Link as LinkIcon,
  Instagram,
  Github,
  Linkedin,
  Camera,
  ChevronRight,
  Flame,
  Sparkles,
  Radio,
  Users,
  Calendar,
  Briefcase,
  Eye,
  Trophy,
  Plus,
  X,
  Loader2,
} from 'lucide-react';

const Profile = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'activity' | 'achievements'>('about');
  const [stats, setStats] = useState({ rooms: 0, events: 0, projects: 0 });
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const { appUser: user, loading, refreshUser } = useAuth();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<Room[]>(`/api/rooms/user/${user.id}`),
      api.get<Room[]>(`/api/rooms/joined/${user.id}`),
    ])
      .then(([created, joined]) => {
        const all = [...created, ...joined];
        setStats({
          rooms: all.length,
          events: all.filter(r => r.roomType === 'EVENT').length,
          projects: all.filter(r => r.roomType === 'PROJECT').length,
        });
      })
      .catch(() => {});
  }, [user]);

  const openEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditUniversity(user.university ?? '');
    setEditAge(user.age?.toString() ?? '');
    setEditAbout(user.about ?? '');
    setEditPhotoUrl(user.photoUrl ?? '');
    setEditPortfolio(user.portfolioUrl ?? '');
    setEditGithub(user.githubUrl ?? '');
    setEditInstagram(user.instagramUrl ?? '');
    setEditLinkedin(user.linkedinUrl ?? '');
    setEditInterests([...user.interests]);
    setEditSkills([...user.skills]);
    setEditOpen(true);
  };

  const addTag = (
    input: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void,
  ) => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
    setInput('');
  };

  const removeTag = (tag: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.filter(t => t !== tag));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.put(`/api/users/${user.id}`, {
        name: editName,
        university: editUniversity || null,
        age: editAge ? parseInt(editAge) : null,
        about: editAbout || null,
        photoUrl: editPhotoUrl || null,
        portfolioUrl: editPortfolio || null,
        githubUrl: editGithub || null,
        instagramUrl: editInstagram || null,
        linkedinUrl: editLinkedin || null,
        interests: editInterests,
        skills: editSkills,
      });
      await refreshUser();
      setEditOpen(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const xpPercentage = user ? Math.min((user.xp / (user.level * 500)) * 100, 100) : 0;

  if (loading || !user) {
    return (
      <AppLayout
        header={
          <div className="px-4 py-3 flex items-center justify-between border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Radio size={12} className="text-primary animate-neon" />
              <h1 className="text-lg font-display font-bold text-foreground">◈ PROFILE</h1>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-accent/20 text-accent" onClick={() => setSettingsOpen(true)}>
              <Settings size={20} />
            </Button>
          </div>
        }
      >
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground font-mono">LOADING...</p>
        </div>
      </AppLayout>
    );
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppLayout
      header={
        <div className="px-4 py-3 flex items-center justify-between border-b border-primary/20">
          <div className="flex items-center gap-2">
            <Radio size={12} className="text-primary animate-neon" />
            <h1 className="text-lg font-display font-bold text-foreground">◈ PROFILE</h1>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-accent/20 text-accent">
            <Settings size={20} />
          </Button>
        </div>
      }
    >
      <div className="px-4 pb-8 space-y-4">
        {/* Avatar + identity */}
        <motion.div
          className="relative pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

          <div
            className="relative w-28 h-28 mx-auto group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-primary"
              animate={{
                boxShadow: isHovered
                  ? '0 0 30px hsl(150, 100%, 50%, 0.5), 0 0 60px hsl(150, 100%, 50%, 0.3)'
                  : '0 0 15px hsl(150, 100%, 50%, 0.3)',
              }}
              transition={{ duration: 0.3 }}
            />

            <div className="relative w-full h-full rounded-lg overflow-hidden">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(1.2) contrast(1.1)' }}
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-mono font-bold text-primary">{initials}</span>
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)',
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center shadow-neon-green border-2 border-card">
                <span className="font-mono font-bold text-sm">L{user.level}</span>
              </div>
            </div>

            <motion.button
              className="absolute top-0 right-0 w-8 h-8 rounded bg-accent text-accent-foreground flex items-center justify-center shadow-neon-purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera size={14} />
            </motion.button>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-display font-bold text-foreground glitch-text">{user.name}</h2>
            <p className="text-primary font-mono text-sm">@{user.name.toLowerCase().replace(/\s/g, '_')}</p>
            {user.university && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-2 font-mono">
                <MapPin size={12} className="text-accent" />
                <span>{user.university}</span>
              </div>
            )}
          </div>

          {/* XP bar */}
          <div className="mt-4 px-4">
            <div className="flex justify-between text-2xs font-mono text-muted-foreground mb-1">
              <span>LEVEL {user.level}</span>
              <span>{user.xp}/{user.level * 500} XP</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-vhs-cyan to-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ boxShadow: '0 0 10px hsl(150, 100%, 50%, 0.5)' }}
              />
            </div>
          </div>

          {/* Streak */}
          {user.streak > 0 && (
            <motion.div
              className="flex items-center justify-center gap-2 mt-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={16} className="text-vhs-pink" />
              <span className="text-sm font-mono font-bold text-vhs-pink">{user.streak} DAY STREAK</span>
              <Flame size={16} className="text-vhs-pink" />
            </motion.div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-0 border-accent/50 text-accent hover:bg-accent/20 font-mono text-xs"
            onClick={openEdit}
          >
            <Edit2 size={12} className="mr-1" />
            EDIT
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { label: 'ROOMS', value: stats.rooms, icon: Users, color: 'primary' },
            { label: 'EVENTS', value: stats.events, icon: Calendar, color: 'accent' },
            { label: 'PROJECTS', value: stats.projects, icon: Briefcase, color: 'primary' },
          ].map(({ label, value, icon: Icon, color }, index) => (
            <motion.div
              key={label}
              className="card-elevated p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Icon size={20} className={`mx-auto mb-2 ${color === 'primary' ? 'text-primary' : 'text-accent'}`} />
              <p className="text-2xl font-mono font-bold text-foreground">{value}</p>
              <p className="text-2xs text-muted-foreground font-mono tracking-wider">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          {(['about', 'activity', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-neon-green'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" />
                  ABOUT
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{user.about || 'No bio yet'}</p>
              </div>

              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-3 text-sm uppercase tracking-wider">◈ INTERESTS</h3>
                {user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, i) => (
                      <motion.span
                        key={interest}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1.5 rounded bg-primary/20 text-primary font-mono text-xs uppercase tracking-wider border border-primary/40"
                      >
                        #{interest}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-mono">No interests added yet</p>
                )}
              </div>

              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-3 text-sm uppercase tracking-wider">◈ SKILLS</h3>
                {user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-3 py-1.5 rounded bg-accent/20 text-accent font-mono text-xs uppercase tracking-wider border border-accent/40"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-mono">No skills added yet</p>
                )}
              </div>

              {(user.portfolioUrl || user.instagramUrl || user.githubUrl || user.linkedinUrl) && (
                <div className="card-elevated overflow-hidden">
                  <h3 className="font-mono font-bold text-foreground p-4 pb-2 text-sm uppercase tracking-wider">◈ LINKS</h3>
                  <div className="divide-y divide-border/50">
                    {[
                      { icon: LinkIcon, url: user.portfolioUrl, label: 'Portfolio', color: 'text-primary' },
                      { icon: Instagram, url: user.instagramUrl, label: 'Instagram', color: 'text-vhs-pink' },
                      { icon: Github, url: user.githubUrl, label: 'GitHub', color: 'text-foreground' },
                      { icon: Linkedin, url: user.linkedinUrl, label: 'LinkedIn', color: 'text-vhs-cyan' },
                    ]
                      .filter(l => l.url)
                      .map(({ icon: Icon, url, label, color }) => (
                        <motion.a
                          key={label}
                          href={url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all group"
                          whileHover={{ x: 5 }}
                        >
                          <Icon size={18} className={`${color} group-hover:animate-neon`} />
                          <span className="flex-1 text-sm text-foreground font-mono truncate">{url}</span>
                          <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.a>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Eye size={14} className="text-primary animate-neon" />
                  RECENT ACTIVITY
                </h3>
                <p className="text-sm text-muted-foreground font-mono text-center py-6">NO ACTIVITY YET</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Trophy size={14} className="text-vhs-yellow animate-neon" />
                  ACHIEVEMENTS
                </h3>
                <p className="text-sm text-muted-foreground font-mono text-center py-6">NO ACHIEVEMENTS YET</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Edit Profile Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="bottom" className="h-[92vh] overflow-y-auto bg-background border-primary/30">
          <SheetHeader className="mb-4">
            <SheetTitle className="font-display font-bold text-foreground glitch-text">◈ EDIT PROFILE</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 pb-8">
            {/* Photo URL */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Photo URL</label>
              <Input
                value={editPhotoUrl}
                onChange={e => setEditPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="font-mono text-sm"
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Name *</label>
              <Input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Your name"
                className="font-mono text-sm"
              />
            </div>

            {/* University */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">University</label>
              <Input
                value={editUniversity}
                onChange={e => setEditUniversity(e.target.value)}
                placeholder="Your university"
                className="font-mono text-sm"
              />
            </div>

            {/* Age */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Age</label>
              <Input
                type="number"
                value={editAge}
                onChange={e => setEditAge(e.target.value)}
                placeholder="Your age"
                className="font-mono text-sm"
                min={16}
                max={99}
              />
            </div>

            {/* About */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">About</label>
              <Textarea
                value={editAbout}
                onChange={e => setEditAbout(e.target.value)}
                placeholder="Tell people about yourself..."
                className="font-mono text-sm resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-2xs text-muted-foreground font-mono mt-1 text-right">{editAbout.length}/500</p>
            </div>

            {/* Interests */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Interests</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={interestInput}
                  onChange={e => setInterestInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(interestInput, editInterests, setEditInterests, setInterestInput))}
                  placeholder="Add interest..."
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-primary/50 text-primary"
                  onClick={() => addTag(interestInput, editInterests, setEditInterests, setInterestInput)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editInterests.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded bg-primary/20 text-primary font-mono text-xs border border-primary/40">
                    #{tag}
                    <button onClick={() => removeTag(tag, editInterests, setEditInterests)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Skills</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(skillInput, editSkills, setEditSkills, setSkillInput))}
                  placeholder="Add skill..."
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-accent/50 text-accent"
                  onClick={() => addTag(skillInput, editSkills, setEditSkills, setSkillInput)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editSkills.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded bg-accent/20 text-accent font-mono text-xs border border-accent/40">
                    {tag}
                    <button onClick={() => removeTag(tag, editSkills, setEditSkills)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <label className="text-2xs font-mono text-muted-foreground uppercase tracking-wider block">Links</label>
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-primary shrink-0" />
                <Input value={editPortfolio} onChange={e => setEditPortfolio(e.target.value)} placeholder="Portfolio URL" className="font-mono text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <Github size={16} className="text-foreground shrink-0" />
                <Input value={editGithub} onChange={e => setEditGithub(e.target.value)} placeholder="GitHub URL" className="font-mono text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={16} className="text-vhs-pink shrink-0" />
                <Input value={editInstagram} onChange={e => setEditInstagram(e.target.value)} placeholder="Instagram URL" className="font-mono text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <Linkedin size={16} className="text-vhs-cyan shrink-0" />
                <Input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="LinkedIn URL" className="font-mono text-sm" />
              </div>
            </div>

            <Button
              className="w-full font-mono font-bold shadow-neon-green"
              onClick={handleSave}
              disabled={saving || !editName.trim()}
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {saving ? 'SAVING...' : 'SAVE PROFILE'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default Profile;
