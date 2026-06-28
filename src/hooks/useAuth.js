import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...firebaseUser, ...userDoc.data() });
        } else {
          setUser({ uid: firebaseUser.uid, ...firebaseUser, role: 'citizen' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  };

  const sendOTP = async (phoneNumber, recaptchaContainerId) => {
    try {
      setupRecaptcha(recaptchaContainerId);
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user exists in Firestore, if not create profile
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          phone: user.phoneNumber,
          role: 'citizen', // Default role
          upvotes_remaining: parseInt(import.meta.env.VITE_UPVOTES_PER_WEEK || '3'),
          created_at: serverTimestamp()
        });
      }
      return user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    sendOTP,
    verifyOTP,
    logout
  };
};
