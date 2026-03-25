export type RoomType = 'EVENT' | 'PROJECT';

export interface RoleRequirement {
  role: string;
  required: number;
  filled: number;
}

export interface Room {
  id: string;
  title: string;
  roomType: RoomType;
  bannerUrl?: string;
  description?: string;
  location?: string;
  dateTime?: string;
  university?: string;
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  tags: string[];
  isUrgent: boolean;
  maxMembers: number;
  currentMembers: number;
  quizRequired: boolean;
  autoAccept: boolean;
  inactivityTimeoutHours?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  age?: number;
  photoUrl?: string;
  interests: string[];
  skills: string[];
  about?: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  level: number;
  xp: number;
  streak: number;
  createdAt: string;
}

export interface Message {
  id: string;
  roomId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
  location?: LocationData;
  attachments?: Attachment[];
  isCurrentUser: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
  label: string;
}

export interface Attachment {
  id: string;
  url: string;
  name: string;
  type: 'IMAGE' | 'FILE';
  mimeType: string;
  size: number;
}

export interface ChatRoom {
  id: string;
  roomId: string;
  roomTitle: string;
  roomType: RoomType;
  memberCount: number;
  memberAvatars: string[];
  createdAt: string;
}

export type UrgentFilter = 'all' | 'this-week' | 'quick-project' | 'starting-soon';
