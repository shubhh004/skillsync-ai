import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../services/authService';
import { getProfile } from '../services/profileService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    getProfile()
      .then(setUser)
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    const u = await getProfile();
    setUser(u);
    return u;
  };

  return (
    <UserContext.Provider value={{ user, loading, error, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
