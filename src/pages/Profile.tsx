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
  ChevronRight
} from 'lucide-react';

const mockUser = {
  id: 'current-user',
  name: 'Taylor Morgan',
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
};

const stats = [
  { label: 'Rooms Joined', value: 12, icon: Users },
  { label: 'Events', value: 8, icon: Calendar },
  { label: 'Projects', value: 4, icon: Briefcase },
];

const Profile = () => {
  return (
    <AppLayout
      header={
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
      }
    >
      <div className="px-4 pb-8">
        {/* Profile Header */}
        <div className="relative mb-6">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={mockUser.photoUrl}
              alt={mockUser.name}
              className="w-full h-full rounded-full object-cover border-4 border-background shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Camera size={14} />
            </button>
          </div>
          
          <div className="text-center mt-3">
            <h2 className="text-xl font-bold text-foreground">{mockUser.name}</h2>
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin size={14} />
              <span>{mockUser.university}</span>
              <span>•</span>
              <span>{mockUser.age} years old</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="absolute top-0 right-0">
            <Edit2 size={14} className="mr-1" />
            Edit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-elevated p-3 text-center">
              <Icon size={18} className="mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-2xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="card-elevated p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground">{mockUser.about}</p>
        </div>

        {/* Interests */}
        <div className="card-elevated p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {mockUser.interests.map(interest => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full text-sm bg-uroom-sky-light text-primary font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card-elevated p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {mockUser.skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-sm bg-uroom-purple-light text-uroom-purple font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="card-elevated overflow-hidden">
          <h3 className="font-semibold text-foreground p-4 pb-2">Links</h3>
          <div className="divide-y divide-border">
            {mockUser.portfolioUrl && (
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <LinkIcon size={18} className="text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{mockUser.portfolioUrl}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            )}
            {mockUser.instagramUrl && (
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <Instagram size={18} className="text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{mockUser.instagramUrl}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            )}
            {mockUser.githubUrl && (
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <Github size={18} className="text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{mockUser.githubUrl}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            )}
            {mockUser.linkedinUrl && (
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <Linkedin size={18} className="text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{mockUser.linkedinUrl}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
