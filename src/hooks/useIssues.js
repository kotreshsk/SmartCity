import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';

export const useIssues = (filters = {}) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      let q = collection(db, 'issues');
      
      const constraints = [];
      
      // We'd typically filter by Geohash for a bounding box, but for simplicity
      // in this MVP hook, we'll just pull recent issues and filter locally if needed,
      // OR rely on a compound index if we added where clauses.
      if (filters.status) constraints.push(where('status', '==', filters.status));
      if (filters.category) constraints.push(where('category', '==', filters.category));
      if (filters.userId) constraints.push(where('reporter_uid', '==', filters.userId));
      
      // Add ordering (needs index in firestore)
      constraints.push(orderBy('created_at', 'desc'));
      constraints.push(limit(100));

      q = query(q, ...constraints);

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const fetchedIssues = [];
          snapshot.forEach((doc) => {
            fetchedIssues.push({ id: doc.id, ...doc.data() });
          });
          setIssues(fetchedIssues);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching issues:", err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // Re-run when filters change

  return { issues, loading, error };
};
