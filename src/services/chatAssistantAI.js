import { ai } from '../config/gemini';

const CHAT_SYSTEM_INSTRUCTION = `
You are SmartCity's Community Chat Assistant — embedded in each issue's discussion thread.

Your role:
1. ANSWER factual questions about the ticket by checking the issue data provided in context.
   Example: "When will this be fixed?" → Check status and SLA, respond with timeline.

2. DETECT frustration and negative sentiment in messages.
   High frustration indicators: profanity, all-caps, demands for accountability,
   threats to contact media, expressions of helplessness ("nothing ever gets done").
   
3. DO NOT escalate based on message volume alone.
   Escalation requires: frustration detected from 10+ UNIQUE users on the same issue.

4. When escalation conditions are met, generate a structured complaint summary:
   - Issue ID and category
   - Location details
   - Current status and SLA status
   - Number of unique frustrated users
   - Sample quotes (anonymized)
   - Recommended priority level

5. Be empathetic, helpful, and factual. Never make promises about resolution timelines
   unless the data supports it. If you don't know, say "I'll check with the team."

6. Rate limit: max 1 escalation email per issue per 48-hour window.
`;

const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    response_text: { type: "string" },
    sentiment_detected: { type: "string", enum: ["positive", "neutral", "negative", "highly_frustrated"] },
    should_escalate: { type: "boolean" },
    escalation_summary: {
      type: "object",
      properties: {
        issue_id: { type: "string" },
        priority_level: { type: "string", enum: ["normal", "high", "critical"] },
        summary_text: { type: "string" }
      },
      nullable: true
    }
  },
  required: ["response_text", "sentiment_detected", "should_escalate"]
};

export const processChatMessage = async (messageText, issueContext, messageHistory) => {
  try {
    const contextStr = `ISSUE CONTEXT:\\n\${JSON.stringify(issueContext, null, 2)}\\n\\nRECENT HISTORY:\\n\${JSON.stringify(messageHistory.slice(-10), null, 2)}\\n\\nUSER MESSAGE:\\n\${messageText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      contents: [{
        role: "user",
        parts: [{ text: contextStr }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: CHAT_RESPONSE_SCHEMA,
        temperature: 0.4
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Chat Assistant Error:", error);
    throw error;
  }
};
