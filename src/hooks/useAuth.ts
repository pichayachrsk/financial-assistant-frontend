import { logoutAction } from '@/lib/actions';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useAuth = () => {
  const isInitialized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (err) {
          console.error('Failed to parse stored user:', err);
        }
      }
    }
    return null;
  });
  
  const router = useRouter();

  const login = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return { 
    user, 
    login, 
    logout, 
    isAuthenticated,
    isInitialized
  };
};
