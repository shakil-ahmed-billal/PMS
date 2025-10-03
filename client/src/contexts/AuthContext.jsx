import React, { createContext, useContext, useEffect, useState } from 'react';
import { demoUsers, demoCredentials, getUserByEmail } from '../lib/demoData';

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

  const signUp = async (email, password, fullName, role) => {
    try {
      // Check if user already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new demo user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
      };

      // Add to demo users array (in real app, this would be persisted)
      demoUsers.push(newUser);
      
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
      // Check demo credentials
      const isValidCredential = Object.values(demoCredentials).some(
        cred => cred.email === email && cred.password === password
      );

      if (!isValidCredential) {
        throw new Error('Invalid email or password');
      }

      const user = getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      setUser(user);
      setProfile(user);
      localStorage.setItem('demo-user', JSON.stringify(user));

      return { data: { user }, error: null };
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
