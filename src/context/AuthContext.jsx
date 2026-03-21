import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign up with email & password
  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    // Enforce explicit login after account creation.
    await signOut(auth);
    return result;
  };

  // Login with email & password
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Password reset
  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = async () => {
    return await signOut(auth);
  };

  const value = {
    user,
    userId: user?.uid || null,
    loading,
    signup,
    login,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
