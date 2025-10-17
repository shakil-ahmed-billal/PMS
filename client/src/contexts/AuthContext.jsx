import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxiosPublic from '../hooks/useAxiosPublic';

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('demo-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfile(userData);
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, fullName, role, leader_id) => {
    try {
      
      const createUser = await axiosPublic.post('/api/users/register', {
        name: fullName,
        email,
        password,
        role: role,
        leader_id
      })

      if (createUser.data.error) {
        toast.error('Wow so easy !');
      }

      const newUser = {
        id: createUser.data._id,
        email: createUser.data.email,
        full_name: createUser.data.name,
        role: createUser.data.role,
        created_at: new Date().toISOString(),
      }

      
      // Auto-login the new user
      setUser(newUser);
      setProfile(newUser);
      localStorage.setItem('demo-user', JSON.stringify(newUser));

      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {

      const userLogin = await axiosPublic.post('/api/users/login', {
        email,
        password
      })

      if (userLogin) {
        console.log(userLogin)
        toast.success('Wow so easy !');
      } else {
        toast.error('Wow so easy !');
      }

      const newUser = {
        id: userLogin.data.user._id,
        email: userLogin.data.user.email,
        full_name: userLogin.data.user.name,
        role: userLogin.data.user.role,
        created_at: new Date().toISOString(),
      }

      // Auto-login the new user
      setUser(newUser);
      setProfile(newUser);
      localStorage.setItem('demo-user', JSON.stringify(newUser));

      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('demo-user');
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
