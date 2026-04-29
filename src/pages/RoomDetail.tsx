import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Room } from '@/types/room';
import { toast } from 'sonner';
import {
  ArrowLeft, MapPin, Calendar, Users, Tag, Zap, Clock,
  CheckCheck, Briefcase, Star, Send, Lock
} from 'lucide-react';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { RoomTypeBadge, UrgentBadge, WrappedUpBadge } from '@/components/ui/RoomTypeBadge';
import { MemberCount } from '@/components/ui/MemberCount';

interface QuizQuestion {
  id: string;
  roomId: string;
  questionType: string;
  question: string;
  options?: string[];
  required: boolean;
  orderIndex: number;
}

interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role?: string;
  status: string;
  joinedAt: string;
}

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [myMembership, setMyMembership] = useState<RoomMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [roomData, memberData] = await Promise.all([
        api.get<Room>(`/api/rooms/${id}`),
        api.get<RoomMember[]>(`/api/rooms/${id}/members`),
      ]);
      setRoom(roomData);
      setMembers(memberData);
      setMyMembership(memberData.find(m => m.userId === user?.id) ?? null);

      if (roomData.quizRequired) {
        const qData = await api.get<QuizQuestion[]>(`/api/rooms/${id}/quiz-questions`);
        setQuestions(qData);
      }
    } catch {
      toast.error('Failed to load room');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!room || !user) return;

    if (room.quizRequired && questions.length > 0 && !showQuiz) {
      setShowQuiz(true);
      return;
    }

    setJoining(true);
    try {
      const quizAnswers = questions.map(q => ({
        questionId: q.id,
        answerText: answers[q.id] ?? '',
      }));

      const body = room.quizRequired ? { quizAnswers } : null;
      const result = await api.post<RoomMember>(`/api/rooms/${id}/join?userId=${user.id}`, body ?? {});
      setMyMembership(result);

      if (room.autoAccept) {
        toast.success(`Joined "${room.title}"! 🎉`);
        setMembers(prev => [...prev, result]);
      } else {
        toast.success('Application sent! Waiting for creator approval.');
      }
      setShowQuiz(false);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to join room');
    } finally {
      setJoining(false);
    }
  };

  const formatDateTime = (date: Date) => {
    if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
    const daysAway = differenceInDays(date, new Date());
    if (daysAway <= 7) return `${format(date, 'EEEE')}, ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  if (loading) {
    return (
      <AppLayout header={
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-foreground font-mono">LOADING...</h1>
        </div>
      }>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary font-mono animate-pulse">◈ LOADING ROOM...</div>
        </div>
      </AppLayout>
    );
  }

  if (!room) return null;

  const eventDate = room.dateTime ? new Date(room.dateTime) : null;
  const isWrappedUp = room.roomType === 'EVENT' && eventDate !== null && eventDate < new Date();
  const isStartingSoon = !isWrappedUp && eventDate !== null && differenceInDays(eventDate, new Date()) <= 1;
  const isFull = room.currentMembers >= room.maxMembers;
  const isCreator = room.creatorId === user?.id;

  const membershipStatus = myMembership?.status;
  const isActive = membershipStatus === 'ACTIVE';
  const isPending = membershipStatus === 'PENDING';

  return (
    <AppLayout header={
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-mono text-sm">BACK</span>
        </button>
        <div className="flex items-center gap-2">
          <RoomTypeBadge type={room.roomType} size="sm" />
          {isWrappedUp && <WrappedUpBadge size="sm" />}
          {!isWrappedUp && room.isUrgent && <UrgentBadge size="sm" variant="urgent" />}
          {!isWrappedUp && !room.isUrgent && isStartingSoon && <UrgentBadge size="sm" variant="soon" />}
        </div>
      </div>
    }>
      <div className="pb-32">
        {/* Banner */}
        {room.bannerUrl ? (
          <div className="relative h-56 overflow-hidden">
            <img
              src={room.bannerUrl}
              alt={room.title}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.2) contrast(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}
            />
          </div>
        ) : (
          <div className={`h-32 ${room.roomType === 'EVENT' ? 'bg-primary/10' : 'bg-accent/10'} flex items-center justify-center`}>
            {room.roomType === 'EVENT' ? (
              <Calendar size={40} className="text-primary/40" />
            ) : (
              <Briefcase size={40} className="text-accent/40" />
            )}
          </div>
        )}

        <div className="px-4 -mt-6 relative space-y-5">
          {/* Creator */}
          {room.creatorAvatar && (
            <div className="flex items-center gap-2">
              <img
                src={room.creatorAvatar}
                alt={room.creatorName}
                className="w-10 h-10 rounded border-2 border-primary object-cover shadow-neon-green"
              />
              <div>
                <p className="text-xs text-muted-foreground font-mono">CREATOR</p>
                <p className="font-mono font-bold text-foreground text-sm">
                  @{room.creatorName?.toLowerCase().replace(/ /g, '_')}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              {room.title}
            </h1>
            {room.description && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{room.description}</p>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-2.5">
            {room.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-primary shrink-0" />
                <span className="text-foreground font-mono">{room.location}</span>
              </div>
            )}
            {room.dateTime && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-accent shrink-0" />
                <span className="vhs-timestamp">{formatDateTime(new Date(room.dateTime))}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Users size={16} className="text-primary shrink-0" />
              <MemberCount current={room.currentMembers} max={room.maxMembers} />
            </div>
            {room.inactivityTimeoutHours && (
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-muted-foreground shrink-0" />
                <span className="text-muted-foreground font-mono text-xs">
                  Inactive members removed after {room.inactivityTimeoutHours}h
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {room.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {room.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-secondary-foreground font-mono uppercase tracking-wider border border-primary/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Members */}
          {members.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">
                ◈ MEMBERS ({members.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {members.map(m => (
                  <div
                    key={m.id}
                    className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center"
                    title={m.userId}
                  >
                    <span className="text-primary text-xs font-mono">◈</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz section */}
          {showQuiz && questions.length > 0 && (
            <div className="space-y-4 p-4 rounded-xl bg-accent/10 border border-accent/30">
              <h3 className="font-mono font-bold text-foreground flex items-center gap-2">
                <Lock size={14} className="text-accent" /> APPLICATION QUESTIONS
              </h3>
              {questions.map(q => (
                <div key={q.id} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {q.question}
                    {q.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {q.questionType === 'text' || !q.options?.length ? (
                    <textarea
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your answer..."
                      value={answers[q.id] ?? ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  ) : (
                    <div className="space-y-1.5">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className="text-primary"
                          />
                          <span className="text-sm text-foreground">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50">
        {isCreator ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono py-2">
            <Star size={14} className="text-accent" /> YOUR ROOM
          </div>
        ) : isWrappedUp ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono py-2">
            <CheckCheck size={14} /> WRAPPED UP
          </div>
        ) : isActive ? (
          <div className="flex items-center justify-center gap-2 text-sm text-primary font-mono py-2">
            <CheckCheck size={14} /> JOINED
          </div>
        ) : isPending ? (
          <div className="flex items-center justify-center gap-2 text-sm text-accent font-mono py-2">
            <Clock size={14} /> PENDING APPROVAL
          </div>
        ) : isFull ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono py-2">
            <Users size={14} /> ROOM IS FULL
          </div>
        ) : (
          <Button
            className="w-full btn-gradient h-12 text-base font-mono font-bold"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? 'PROCESSING...' : showQuiz ? (
              <><Send size={16} className="mr-2" /> SUBMIT APPLICATION</>
            ) : room.quizRequired ? (
              <><Lock size={16} className="mr-2" /> APPLY TO JOIN</>
            ) : (
              <><Zap size={16} className="mr-2" /> JOIN ROOM</>
            )}
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default RoomDetail;
