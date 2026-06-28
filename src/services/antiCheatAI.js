import { ai } from '../config/gemini';
import { calculateDistanceMeters } from '../utils/helpers';

const ANTICHEAT_SYSTEM_INSTRUCTION = `
You are SmartCity's Anti-Cheat AI — a verification expert that prevents fraudulent resolution claims.

You will receive TWO sets of media:
1. BEFORE: The original issue report (photo + optional video)
2. AFTER: The contractor's resolution proof (photo + video)

You also receive GPS coordinates for both submissions.

Your verification steps:

STEP 1 — LOCATION VERIFICATION:
Compare the two GPS coordinates provided in the prompt. They must be within 10 meters of each other.
Look for visual landmarks (buildings, signs, road markings) that confirm same location.
Result: location_match (true/false) + confidence (0-1)

STEP 2 — REPAIR VERIFICATION:
Compare the BEFORE and AFTER images using visual analysis:
- Is the reported problem (pothole, leak, broken light, etc.) visibly ABSENT or REPAIRED in the AFTER image?
- Don't just check if the location matches — verify the ACTUAL REPAIR.
- A matching location with the problem still visible = FAIL.
Result: repair_verified (true/false) + confidence (0-1) + explanation

STEP 3 — VIDEO CONTINUITY CHECK (if video provided):
Analyze the AFTER video for signs of fraud:
- Jump cuts (sudden scene changes)
- Freeze frames (identical consecutive frames)
- Looping (repeating segments)
- Extremely short duration (< 3 seconds of actual content)
Result: video_authentic (true/false) + issues_detected (array)

Return your analysis as structured JSON.
`;

const ANTICHEAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    overall_verdict: { type: "string", enum: ["pass", "fail", "needs_review"] },
    location_match: { type: "boolean" },
    location_confidence: { type: "number" },
    repair_verified: { type: "boolean" },
    repair_confidence: { type: "number" },
    repair_explanation: { type: "string" },
    video_authentic: { type: "boolean" },
    video_issues: { type: "array", items: { type: "string" } },
    rejection_reason: { type: "string" }
  },
  required: ["overall_verdict", "location_match", "repair_verified"]
};

export const verifyResolution = async (beforeImageBase64, afterImageBase64, beforeCoords, afterCoords) => {
  try {
    const distance = calculateDistanceMeters(beforeCoords.lat, beforeCoords.lng, afterCoords.lat, afterCoords.lng);
    const coordsText = `BEFORE GPS: \${beforeCoords.lat}, \${beforeCoords.lng}\\nAFTER GPS: \${afterCoords.lat}, \${afterCoords.lng}\\nCalculated distance: \${distance.toFixed(2)} meters.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      systemInstruction: ANTICHEAT_SYSTEM_INSTRUCTION,
      contents: [{
        role: "user",
        parts: [
          { text: "BEFORE IMAGE:" },
          { inlineData: { data: beforeImageBase64.split(',')[1] || beforeImageBase64, mimeType: "image/jpeg" } },
          { text: "AFTER IMAGE:" },
          { inlineData: { data: afterImageBase64.split(',')[1] || afterImageBase64, mimeType: "image/jpeg" } },
          { text: coordsText }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: ANTICHEAT_RESPONSE_SCHEMA,
        temperature: 0.1
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Anti-Cheat Error:", error);
    throw error;
  }
};
