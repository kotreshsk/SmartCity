import { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';

export const useUpvotes = (userId) => {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const upvoteIssue = async (issueId, currentUpvotesRemaining) => {
    if (!userId || currentUpvotesRemaining <= 0) return false;
    
    setIsUpvoting(true);
    try {
      // 1. Update issue document
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        upvote_count: increment(1),
        urgency_score: increment(0.5),
        upvoter_uids: arrayUnion(userId),
        updated_at: serverTimestamp()
      });

      // 2. Update user document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        upvotes_remaining: increment(-1),
        upvoted_issues: arrayUnion(issueId)
      });
      
      setIsUpvoting(false);
      return true;
    } catch (error) {
      console.error("Upvote error:", error);
      setIsUpvoting(false);
      return false;
    }
  };

  return { upvoteIssue, isUpvoting };
};
