import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '../services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

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
          setUnreadCount(prev => prev + 1);
        }
      } catch (err) {
        console.error("Notification listener error:", err);
      }
    };
    
    listen();
  }, []);

  return { unreadCount };
};
