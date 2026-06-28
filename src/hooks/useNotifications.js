import { useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      requestNotificationPermission(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const listen = async () => {
      try {
        const payload = await onMessageListener();
        if (payload) {
          // Display a toast or handle the notification foreground event
          console.log("Foreground notification received:", payload);
          // E.g. add to a toast context
        }
      } catch (err) {
        console.error("Notification listener error:", err);
      }
    };
    
    listen();
  }, []);
};
