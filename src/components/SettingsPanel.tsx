import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, LogOut, Radio, Bell, BellOff, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<boolean>(() => {
    return localStorage.getItem('notifications') !== 'false';
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleNotifications = (val: boolean) => {
    setNotifications(val);
    localStorage.setItem('notifications', String(val));
  };

  useEffect(() => {
    if (!open) {
      setConfirmDelete(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await api.delete(`/api/users/${user.id}`);
      signOut();
      navigate('/login');
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-72 z-50 bg-card border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-primary" />
                <span className="font-mono text-sm font-bold text-foreground tracking-wider">SETTINGS</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
              {/* Theme */}
              <section className="space-y-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Appearance</p>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all font-mono text-xs ${
                        theme === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === value ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        {icon}
                      </span>
                      {label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>

              {/* Notifications */}
              <section className="space-y-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Notifications</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: 'On', icon: <Bell size={16} /> },
                    { value: false, label: 'Off', icon: <BellOff size={16} /> },
                  ].map(({ value, label, icon }) => (
                    <button
                      key={String(value)}
                      onClick={() => toggleNotifications(value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all font-mono text-xs ${
                        notifications === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        notifications === value ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        {icon}
                      </span>
                      {label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>

              {/* Account */}
              <section className="space-y-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Account</p>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted/50 transition-colors font-mono text-sm"
                >
                  <LogOut size={16} />
                  SIGN OUT
                </button>

                <AnimatePresence mode="wait">
                  {confirmDelete ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle size={15} />
                        <span className="font-mono text-xs font-bold">DELETE ACCOUNT?</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                        This is permanent. All your data, rooms, and history will be removed.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setConfirmDelete(false)}
                          disabled={deleting}
                          className="py-2 rounded-lg border border-border bg-muted/30 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                          className="py-2 rounded-lg bg-destructive text-destructive-foreground font-mono text-xs font-bold hover:bg-destructive/90 transition-colors disabled:opacity-60"
                        >
                          {deleting ? 'DELETING...' : 'YES, DELETE'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="delete-btn"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onClick={() => setConfirmDelete(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors font-mono text-sm"
                    >
                      <Trash2 size={16} />
                      DELETE ACCOUNT
                    </motion.button>
                  )}
                </AnimatePresence>
              </section>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
