export type RoomType = 'EVENT' | 'PROJECT';

export interface RoleRequirement {
  role: string;
  required: number;
  filled: number;
}

export interface Room {
  id: string;
  title: string;
  type: RoomType;
  bannerUrl: string;
  description: string;
  location: string;
  dateTime: Date;
  university: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  tags: string[];
  isUrgent: boolean;
  maxMembers: number;
  currentMembers: number;
  roleRequirements: RoleRequirement[];
  quizRequired?: boolean;
  autoAccept?: boolean;
  inactivityPolicy?: {
    enabled: boolean;
    timeoutHours: 24 | 36 | 48;
  };
  aiRecommendation?: {
    score: number;
    reasons: string[];
  };
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  age?: number;
  photoUrl: string;
  interests: string[];
  skills: string[];
  about: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: Date;
}

export type UrgentFilter = 'all' | 'this-week' | 'quick-project' | 'starting-soon';
