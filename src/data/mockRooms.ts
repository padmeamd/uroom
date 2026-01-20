import { Room } from '@/types/room';

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

export const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Short Film: "The Last Lecture"',
    type: 'PROJECT',
    bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    description: 'Looking for passionate filmmakers to create a 10-min short film about a professor\'s final class. We have the script ready!',
    location: 'UCLA Campus',
    dateTime: in3Days,
    university: 'UCLA',
    creatorId: 'u1',
    creatorName: 'Alex Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    tags: ['Film', 'Drama', 'Storytelling', 'Creative'],
    isUrgent: true,
    maxMembers: 6,
    currentMembers: 2,
    roleRequirements: [
      { role: 'Director', required: 1, filled: 1 },
      { role: 'Camera', required: 1, filled: 0 },
      { role: 'Editor', required: 1, filled: 1 },
      { role: 'Actor', required: 2, filled: 0 },
      { role: 'Sound', required: 1, filled: 0 },
    ],
    quizRequired: true,
    autoAccept: false,
    inactivityPolicy: { enabled: true, timeoutHours: 24 },
    aiRecommendation: {
      score: 95,
      reasons: ['Film + Photography match', 'Needs editor role', 'Starting this week'],
    },
    createdAt: now,
  },
  {
    id: '2',
    title: 'Board Game Night 🎲',
    type: 'EVENT',
    bannerUrl: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800&q=80',
    description: 'Chill evening of Catan, Codenames, and snacks! All skill levels welcome. Bringing my collection!',
    location: 'Student Union Room 204',
    dateTime: tomorrow,
    university: 'UCLA',
    creatorId: 'u2',
    creatorName: 'Jamie Park',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    tags: ['Games', 'Social', 'Chill', 'Fun'],
    isUrgent: true,
    maxMembers: 8,
    currentMembers: 4,
    roleRequirements: [],
    autoAccept: true,
    aiRecommendation: {
      score: 88,
      reasons: ['Social activity', 'Tomorrow evening', 'Open to all'],
    },
    createdAt: now,
  },
  {
    id: '3',
    title: 'Startup MVP Sprint 🚀',
    type: 'PROJECT',
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    description: 'Building a campus food delivery app. Need devs and a designer for 2-week sprint. Equity possible!',
    location: 'Remote + Weekly Meetups',
    dateTime: nextWeek,
    university: 'UCLA',
    creatorId: 'u3',
    creatorName: 'Marcus Johnson',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    tags: ['Startup', 'Tech', 'React', 'Mobile'],
    isUrgent: false,
    maxMembers: 5,
    currentMembers: 2,
    roleRequirements: [
      { role: 'Frontend Dev', required: 2, filled: 1 },
      { role: 'Backend Dev', required: 1, filled: 1 },
      { role: 'UI/UX Designer', required: 1, filled: 0 },
      { role: 'PM', required: 1, filled: 0 },
    ],
    quizRequired: true,
    autoAccept: false,
    inactivityPolicy: { enabled: true, timeoutHours: 48 },
    aiRecommendation: {
      score: 82,
      reasons: ['Tech skills match', 'Startup interest', 'Remote friendly'],
    },
    createdAt: now,
  },
  {
    id: '4',
    title: 'Photography Walk: Golden Hour',
    type: 'EVENT',
    bannerUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    description: 'Capture stunning golden hour shots around campus. Bring any camera - phone is fine! Will share tips.',
    location: 'Sculpture Garden',
    dateTime: in3Days,
    university: 'UCLA',
    creatorId: 'u4',
    creatorName: 'Sophie Williams',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    tags: ['Photography', 'Art', 'Outdoors', 'Creative'],
    isUrgent: false,
    maxMembers: 12,
    currentMembers: 7,
    roleRequirements: [],
    autoAccept: true,
    aiRecommendation: {
      score: 91,
      reasons: ['Photography interest', 'Creative activity', 'Beginner friendly'],
    },
    createdAt: now,
  },
  {
    id: '5',
    title: 'Hackathon Team: AI for Good',
    type: 'PROJECT',
    bannerUrl: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&q=80',
    description: 'Forming a team for the upcoming AI hackathon. Let\'s build something that matters! 48hr sprint.',
    location: 'Engineering Building',
    dateTime: tomorrow,
    university: 'UCLA',
    creatorId: 'u5',
    creatorName: 'David Kim',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    tags: ['AI', 'Hackathon', 'Machine Learning', 'Social Impact'],
    isUrgent: true,
    maxMembers: 4,
    currentMembers: 1,
    roleRequirements: [
      { role: 'ML Engineer', required: 1, filled: 1 },
      { role: 'Full Stack Dev', required: 2, filled: 0 },
      { role: 'Designer', required: 1, filled: 0 },
    ],
    quizRequired: true,
    autoAccept: false,
    inactivityPolicy: { enabled: true, timeoutHours: 24 },
    aiRecommendation: {
      score: 78,
      reasons: ['Tech + AI match', 'Starting tomorrow', 'Urgent team forming'],
    },
    createdAt: now,
  },
  {
    id: '6',
    title: 'Coffee & Code ☕',
    type: 'EVENT',
    bannerUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    description: 'Casual coding session at the campus café. Work on your projects, get help, or just hang out with fellow devs!',
    location: 'Kerckhoff Coffee House',
    dateTime: in3Days,
    university: 'UCLA',
    creatorId: 'u6',
    creatorName: 'Emma Rodriguez',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    tags: ['Coding', 'Social', 'Networking', 'Casual'],
    isUrgent: false,
    maxMembers: 15,
    currentMembers: 6,
    roleRequirements: [],
    autoAccept: true,
    aiRecommendation: {
      score: 85,
      reasons: ['Coding interest', 'Networking opportunity', 'Relaxed atmosphere'],
    },
    createdAt: now,
  },
];

export const getFilteredRooms = (
  rooms: Room[],
  filter: 'all' | 'this-week' | 'quick-project' | 'starting-soon',
  type?: 'EVENT' | 'PROJECT' | 'all'
): Room[] => {
  let filtered = [...rooms];
  
  // Filter by type
  if (type && type !== 'all') {
    filtered = filtered.filter(room => room.type === type);
  }
  
  const now = new Date();
  const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  switch (filter) {
    case 'this-week':
      filtered = filtered.filter(room => room.dateTime <= oneWeek);
      break;
    case 'quick-project':
      filtered = filtered.filter(
        room => room.type === 'PROJECT' && room.dateTime <= threeDays
      );
      break;
    case 'starting-soon':
      filtered = filtered.filter(room => room.dateTime <= oneDay);
      break;
    default:
      break;
  }
  
  // Sort by urgency and AI score
  filtered.sort((a, b) => {
    // Urgent rooms first
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    
    // Then by AI score
    const scoreA = a.aiRecommendation?.score || 0;
    const scoreB = b.aiRecommendation?.score || 0;
    return scoreB - scoreA;
  });
  
  return filtered;
};
