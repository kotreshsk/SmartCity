import { ai } from '../config/gemini';

const SORTER_SYSTEM_INSTRUCTION = `
You are SmartCity's Issue Sorter AI — a civic infrastructure classification expert.
You analyze photos and videos of civic issues reported by citizens.

Your responsibilities:
1. CLASSIFY the issue into exactly one category from this list:
   - pothole_road_damage
   - water_leakage_flooding
   - broken_streetlight
   - waste_garbage_overflow
   - damaged_public_property
   - fallen_tree_obstruction
   - other_uncategorized

2. DETECT if this is a photo-of-a-photo (re-photography):
   Look for: moiré patterns, screen glare/reflection, pixel grid visible,
   abnormal texture flatness, frame-within-a-frame, screen bezels visible,
   unnatural color banding, warped perspective of a flat screen.
   Return is_rephoto: true/false with confidence.

3. GENERATE a concise description (max 100 words) of the issue visible in the image.

4. ASSIGN an urgency score (1-10) based on:
   - Water leakage/flooding: base 8-10 (immediate danger)
   - Fallen tree/obstruction: base 7-9 (blocks access)
   - Pothole on main road: base 6-8 (vehicle damage risk)
   - Broken streetlight: base 5-7 (safety at night)
   - Waste overflow: base 4-6 (health hazard)
   - Damaged property: base 3-5 (aesthetic/functional)
   Adjust +1 if issue appears large/severe, -1 if minor.

You MUST respond in valid JSON matching this exact schema. No markdown, no explanation outside the JSON.
`;

const SORTER_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["pothole_road_damage", "water_leakage_flooding", "broken_streetlight",
             "waste_garbage_overflow", "damaged_public_property", 
             "fallen_tree_obstruction", "other_uncategorized"]
    },
    description: { type: "string" },
    urgency_score: { type: "integer" },
    is_rephoto: { type: "boolean" },
    rephoto_confidence: { type: "number" },
    rephoto_indicators: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["category", "description", "urgency_score", "is_rephoto", "rephoto_confidence"]
};

export const classifyIssue = async (imageBase64, mimeType = "image/jpeg") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      systemInstruction: SORTER_SYSTEM_INSTRUCTION,
      contents: [{
        role: "user",
        parts: [
          { inlineData: { data: imageBase64.split(',')[1] || imageBase64, mimeType } },
          { text: "Analyze this civic issue photo. Classify it, check for re-photography, describe the problem, and score urgency." }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: SORTER_RESPONSE_SCHEMA,
        temperature: 0.1
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Sorter Error:", error);
    throw error;
  }
};

export const processIssueImage = async (blob, location) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64data = reader.result;
        // Optionally use location to influence analysis, though currently ignored by classifyIssue
        const result = await classifyIssue(base64data, blob.type);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
