import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, tokenStorage } from '@/lib/api';
import { User as AppUser } from '@/types/room';

interface AuthResponse {
  token: string;
  user: AppUser;
}

interface AuthContextType {
  user: AppUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      api.get<AppUser>('/api/auth/me')
        .then(setUser)
        .catch(() => tokenStorage.remove())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await api.post<AuthResponse>('/api/auth/login', { email, password });
    tokenStorage.set(data.token);
    setUser(data.user);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const data = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
    tokenStorage.set(data.token);
    setUser(data.user);
  };

  const signOut = () => {
    tokenStorage.remove();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, appUser: user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
