import { useEffect, useState, useCallback } from 'react';
import { X, Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  roomId: string | null;
  roomTitle: string | null;
  triggeredByName: string | null;
  triggeredByAvatar: string | null;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, string> = {
  NEW_MEMBER: '👥',
  JOIN_REQUEST: '📩',
  JOIN_ACCEPTED: '✅',
  JOIN_REJECTED: '❌',
  KICKED: '🚫',
  ADDED_TO_CHAT: '💬',
  NEW_MESSAGE: '✉️',
  TAGGED_IN_CHAT: '🏷️',
};

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export function NotificationsPanel({ open, onClose, onUnreadChange }: NotificationsPanelProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get<Notification[]>(`/api/notifications?userId=${user.id}`, true);
      setNotifications(data);
      const unread = data.filter(n => !n.read).length;
      onUnreadChange?.(unread);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [user, onUnreadChange]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const markRead = async (id: string) => {
    try {
      await api.put<Notification>(`/api/notifications/${id}/read`, {});
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      const unread = notifications.filter(n => !n.read && n.id !== id).length;
      onUnreadChange?.(unread);
    } catch {
      // silently fail
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    try {
      await api.put<void>(`/api/notifications/read-all?userId=${user.id}`, {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onUnreadChange?.(0);
    } catch {
      // silently fail
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-accent" />
            <h2 className="font-display font-bold text-foreground">NOTIFICATIONS</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-vhs-pink text-white text-xs font-mono font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
                onClick={markAllRead}
              >
                <CheckCheck size={14} />
                All read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground font-mono text-sm">
              LOADING...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-8">
              <Bell size={32} className="text-muted-foreground/40" />
              <p className="text-muted-foreground font-mono text-sm">NO NOTIFICATIONS</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={() => markRead(n.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NotificationItem({
  notification: n,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: () => void;
}) {
  const icon = TYPE_ICON[n.type] ?? '🔔';
  const timeAgo = formatDistanceToNow(new Date(n.createdAt), { addSuffix: true });

  return (
    <div
      className={`flex gap-3 px-4 py-3 transition-colors ${
        n.read ? 'opacity-60' : 'bg-primary/5'
      }`}
    >
      {/* Avatar / icon */}
      <div className="shrink-0 mt-0.5">
        {n.triggeredByAvatar ? (
          <img
            src={n.triggeredByAvatar}
            alt={n.triggeredByName ?? ''}
            className="w-9 h-9 rounded border border-primary/30 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded border border-primary/30 bg-primary/10 flex items-center justify-center text-base">
            {icon}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.message}</p>
        <p className="text-2xs text-muted-foreground/60 font-mono mt-1">{timeAgo}</p>
      </div>

      {/* Mark read */}
      {!n.read && (
        <button
          onClick={onMarkRead}
          className="shrink-0 mt-1 w-5 h-5 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors"
          title="Mark as read"
        >
          <Check size={10} className="text-primary" />
        </button>
      )}
    </div>
  );
}
