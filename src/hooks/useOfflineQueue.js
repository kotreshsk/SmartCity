import { useEffect } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'smartcity-offline-db';
const STORE_NAME = 'issue-queue';

export const useOfflineQueue = () => {
  
  const initDB = async () => {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  };

  const addToQueue = async (issueData) => {
    const db = await initDB();
    await db.add(STORE_NAME, {
      ...issueData,
      queuedAt: new Date().toISOString()
    });
  };

  const getQueue = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  };

  const removeFromQueue = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
  };

  // Setup service worker message listener for offline/online synchronization status if needed
  useEffect(() => {
    // In a full implementation, we'd listen for the 'online' event here
    // and trigger a background sync to process the queue via issueService.
    const handleOnline = async () => {
      console.log('App is online. Processing queue...');
      // Process queue logic would go here
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return {
    addToQueue,
    getQueue,
    removeFromQueue
  };
};
