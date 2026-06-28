import { db } from '../config/firebase';
import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, GeoPoint, increment, onSnapshot } from 'firebase/firestore';

const ISSUES_COLLECTION = 'issues';

export const createIssue = async (issueData) => {
  try {
    const newIssue = {
      ...issueData,
      location: new GeoPoint(issueData.lat, issueData.lng),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: 'received',
      upvote_count: 0,
      upvoter_uids: [],
      is_overdue: false,
      disputed: false
    };
    
    // Remove temporary lat/lng
    delete newIssue.lat;
    delete newIssue.lng;

    const docRef = await addDoc(collection(db, ISSUES_COLLECTION), newIssue);
    return docRef.id;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

export const updateIssueStatus = async (issueId, newStatus, userId, notes = '') => {
  try {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    await updateDoc(issueRef, {
      status: newStatus,
      updated_at: serverTimestamp()
    });

    // Add to history
    await addDoc(collection(issueRef, 'status_history'), {
      to_status: newStatus,
      changed_by: userId,
      notes,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating issue status:", error);
    throw error;
  }
};

export const submitProof = async (issueId, proofData) => {
  try {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    await updateDoc(issueRef, {
      status: 'resolved_pending',
      proof_image_url: proofData.imageUrl,
      proof_video_url: proofData.videoUrl || null,
      proof_submitted_at: serverTimestamp(),
      proof_location: new GeoPoint(proofData.lat, proofData.lng),
      proof_hash: proofData.hash,
      anticheat_result: proofData.anticheatResult,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error("Error submitting proof:", error);
    throw error;
  }
};

export const getIssue = async (issueId) => {
  try {
    const docRef = doc(db, ISSUES_COLLECTION, issueId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting issue:", error);
    throw error;
  }
};

export const issueService = {
  createIssue,
  updateIssueStatus,
  submitProof,
  getIssue
};
