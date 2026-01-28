import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Edit2, 
  MapPin, 
  Link as LinkIcon, 
  Instagram, 
  Github, 
  Linkedin,
  Camera,
  Calendar,
  Briefcase,
  Users,
  ChevronRight,
  Zap,
  Star,
  Trophy,
  Flame,
  Sparkles,
  Radio,
  Eye,
  Heart
} from 'lucide-react';

const mockUser = {
  id: 'current-user',
  name: 'Taylor Morgan',
  handle: 'taylor_m',
  email: 'taylor@ucla.edu',
  university: 'UCLA',
  age: 21,
  photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  interests: ['Film', 'Photography', 'Startups', 'AI', 'Music'],
  skills: ['Video Editing', 'React', 'Python', 'UI Design', 'Storytelling'],
  about: 'Film student passionate about visual storytelling. Looking to collaborate on creative projects and meet fellow creators! 🎬',
  portfolioUrl: 'https://taylor.dev',
  instagramUrl: '@taylor.creates',
  githubUrl: 'taylorm',
  linkedinUrl: 'taylormorgan',
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 7,
  joinedDate: 'Sept 2024',
};

const stats = [
  { label: 'ROOMS', value: 12, icon: Users, color: 'primary' },
  { label: 'EVENTS', value: 8, icon: Calendar, color: 'accent' },
  { label: 'PROJECTS', value: 4, icon: Briefcase, color: 'primary' },
];

const achievements = [
  { id: 1, icon: Trophy, label: 'First Room', unlocked: true },
  { id: 2, icon: Flame, label: '7 Day Streak', unlocked: true },
  { id: 3, icon: Star, label: 'Top Creator', unlocked: true },
  { id: 4, icon: Heart, label: '50 Connections', unlocked: false },
  { id: 5, icon: Zap, label: 'Speed Runner', unlocked: false },
];

const recentActivity = [
  { id: 1, type: 'joined', room: 'Film Club Meetup', time: '2h ago' },
  { id: 2, type: 'created', room: 'Short Film Project', time: '1d ago' },
  { id: 3, type: 'completed', room: 'Photography Walk', time: '3d ago' },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'activity' | 'achievements'>('about');
  const [isHovered, setIsHovered] = useState(false);

  const xpPercentage = (mockUser.xp / mockUser.xpToNext) * 100;

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
      <div className="px-4 pb-8">
        {/* Profile Header with VHS effect */}
        <motion.div 
          className="relative mb-6 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          
          <div 
            className="relative w-28 h-28 mx-auto group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated ring */}
            <motion.div 
              className="absolute inset-0 rounded-lg border-2 border-primary"
              animate={{ 
                boxShadow: isHovered 
                  ? '0 0 30px hsl(150, 100%, 50%, 0.5), 0 0 60px hsl(150, 100%, 50%, 0.3)' 
                  : '0 0 15px hsl(150, 100%, 50%, 0.3)'
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Profile image with VHS scanlines */}
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <img
                src={mockUser.photoUrl}
                alt={mockUser.name}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(1.2) contrast(1.1)' }}
              />
              {/* Scanline overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
                }}
              />
              {/* Level badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center shadow-neon-green border-2 border-card">
                <span className="font-mono font-bold text-sm">L{mockUser.level}</span>
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
            <h2 className="text-2xl font-display font-bold text-foreground glitch-text">{mockUser.name}</h2>
            <p className="text-primary font-mono text-sm">@{mockUser.handle}</p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-2 font-mono">
              <MapPin size={12} className="text-accent" />
              <span>{mockUser.university}</span>
              <span className="text-primary">•</span>
              <span>SINCE {mockUser.joinedDate.toUpperCase()}</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 px-4">
            <div className="flex justify-between text-2xs font-mono text-muted-foreground mb-1">
              <span>LEVEL {mockUser.level}</span>
              <span>{mockUser.xp}/{mockUser.xpToNext} XP</span>
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

          {/* Streak indicator */}
          <motion.div 
            className="flex items-center justify-center gap-2 mt-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame size={16} className="text-vhs-pink" />
            <span className="text-sm font-mono font-bold text-vhs-pink">{mockUser.streak} DAY STREAK</span>
            <Flame size={16} className="text-vhs-pink" />
          </motion.div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-4 right-0 border-accent/50 text-accent hover:bg-accent/20 font-mono text-xs"
          >
            <Edit2 size={12} className="mr-1" />
            EDIT
          </Button>
        </motion.div>

        {/* Stats with animation */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map(({ label, value, icon: Icon, color }, index) => (
            <motion.div 
              key={label} 
              className={`card-elevated p-4 text-center cursor-pointer group`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Icon size={20} className={`mx-auto mb-2 ${color === 'primary' ? 'text-primary' : 'text-accent'} group-hover:animate-neon`} />
              <p className="text-2xl font-mono font-bold text-foreground">{value}</p>
              <p className="text-2xs text-muted-foreground font-mono tracking-wider">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 p-1 bg-muted/50 rounded-lg">
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

        {/* Tab Content */}
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
              {/* About */}
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" />
                  ABOUT
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mockUser.about}</p>
              </div>

              {/* Interests */}
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-3 text-sm uppercase tracking-wider">◈ INTERESTS</h3>
                <div className="flex flex-wrap gap-2">
                  {mockUser.interests.map((interest, i) => (
                    <motion.span
                      key={interest}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1.5 rounded bg-primary/20 text-primary font-mono text-xs uppercase tracking-wider border border-primary/40 cursor-pointer hover:bg-primary/30 hover:shadow-neon-green transition-all"
                    >
                      #{interest}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-3 text-sm uppercase tracking-wider">◈ SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                  {mockUser.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1.5 rounded bg-accent/20 text-accent font-mono text-xs uppercase tracking-wider border border-accent/40 cursor-pointer hover:bg-accent/30 hover:shadow-neon-purple transition-all"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="card-elevated overflow-hidden">
                <h3 className="font-mono font-bold text-foreground p-4 pb-2 text-sm uppercase tracking-wider">◈ LINKS</h3>
                <div className="divide-y divide-border/50">
                  {[
                    { icon: LinkIcon, url: mockUser.portfolioUrl, color: 'text-primary' },
                    { icon: Instagram, url: mockUser.instagramUrl, color: 'text-vhs-pink' },
                    { icon: Github, url: mockUser.githubUrl, color: 'text-foreground' },
                    { icon: Linkedin, url: mockUser.linkedinUrl, color: 'text-vhs-cyan' },
                  ].filter(l => l.url).map(({ icon: Icon, url, color }, i) => (
                    <motion.a 
                      key={i}
                      href="#" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <Icon size={18} className={`${color} group-hover:animate-neon`} />
                      <span className="flex-1 text-sm text-foreground font-mono">{url}</span>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="card-elevated p-4">
                <h3 className="font-mono font-bold text-foreground mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Eye size={14} className="text-primary animate-neon" />
                  RECENT ACTIVITY
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded bg-muted/30 border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        activity.type === 'joined' ? 'bg-primary/20 text-primary' :
                        activity.type === 'created' ? 'bg-accent/20 text-accent' :
                        'bg-vhs-pink/20 text-vhs-pink'
                      }`}>
                        {activity.type === 'joined' ? <Users size={14} /> :
                         activity.type === 'created' ? <Briefcase size={14} /> :
                         <Star size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">
                          {activity.type === 'joined' && 'Joined '}
                          {activity.type === 'created' && 'Created '}
                          {activity.type === 'completed' && 'Completed '}
                          <span className="text-primary">{activity.room}</span>
                        </p>
                        <p className="text-2xs text-muted-foreground font-mono">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((achievement, i) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: achievement.unlocked ? 1.1 : 1 }}
                      className={`flex flex-col items-center p-3 rounded border ${
                        achievement.unlocked 
                          ? 'bg-vhs-yellow/10 border-vhs-yellow/50 cursor-pointer' 
                          : 'bg-muted/30 border-border/50 opacity-50'
                      }`}
                    >
                      <achievement.icon 
                        size={24} 
                        className={achievement.unlocked ? 'text-vhs-yellow animate-neon' : 'text-muted-foreground'} 
                      />
                      <span className={`text-2xs font-mono mt-2 text-center ${
                        achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-2xs text-muted-foreground font-mono mt-4">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length} UNLOCKED
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Profile;
