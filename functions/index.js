const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// 1. SLA Monitoring (Cron Job) - Runs every hour
exports.checkSLA = functions.pubsub.schedule("every 1 hours").onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();
  const snapshot = await db.collection("issues")
    .where("status", "in", ["received", "reviewed", "under_progress"])
    .where("sla_deadline", "<", now)
    .where("is_overdue", "==", false)
    .get();

  const batch = db.batch();
  let count = 0;

  snapshot.forEach((doc) => {
    batch.update(doc.ref, { 
      is_overdue: true,
      status: "escalated" 
    });
    
    // Create an escalation notification for admins
    const notificationRef = db.collection("notifications").doc();
    batch.set(notificationRef, {
      type: "escalation",
      issue_id: doc.id,
      message: `Issue ${doc.id} has breached its SLA.`,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      recipient_role: "admin"
    });
    
    count++;
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Escalated ${count} overdue issues.`);
  }
  return null;
});

// 2. Data Tamper Protection - Hash Generation on Issue Create
exports.generateIssueHash = functions.firestore
  .document('issues/{issueId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Create deterministic string to hash
    const dataString = `${data.user_id}|${data.location.lat}|${data.location.lng}|${data.description}|${data.created_at.toMillis()}`;
    
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    
    return snap.ref.update({
      tamper_hash: hash,
      verified_integrity: true
    });
  });

// 3. Gamification - Award Badge on Report Resolution Verification
exports.awardBadgeOnResolution = functions.firestore
  .document('issues/{issueId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    
    // When issue goes from resolved_pending to resolved (user verified)
    if (newValue.status === 'resolved' && previousValue.status === 'resolved_pending') {
      const userId = newValue.user_id;
      
      const userRef = db.collection('users').doc(userId);
      
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) return;
        
        const userData = userDoc.data();
        const currentScore = userData.reputation_score || 0;
        const verifiedCount = (userData.verified_resolutions || 0) + 1;
        
        const updates = {
          reputation_score: currentScore + 50,
          verified_resolutions: verifiedCount
        };
        
        // Example simple badge logic
        const badges = userData.badges || [];
        if (verifiedCount === 1 && !badges.includes('first_blood')) {
          updates.badges = admin.firestore.FieldValue.arrayUnion('first_blood');
        }
        if (verifiedCount >= 5 && !badges.includes('eagle_eye')) {
            updates.badges = admin.firestore.FieldValue.arrayUnion('eagle_eye');
        }

        t.update(userRef, updates);
      });
      
      // Notify user
      await db.collection("notifications").add({
        type: "badge_earned",
        user_id: userId,
        message: "Your reported issue was resolved! You earned 50 reputation points.",
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });
    }
  });
