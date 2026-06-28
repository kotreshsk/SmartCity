import { messaging, db } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';

export const requestNotificationPermission = async (userId) => {
  if (!messaging) {
    console.warn("Messaging not supported.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'dummy_vapid_key'
      });
      
      if (token) {
        // Save token to user profile
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { fcm_token: token });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const onMessageListener = () => {
  if (!messaging) return new Promise((resolve) => resolve(null));
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
