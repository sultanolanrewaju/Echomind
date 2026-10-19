import { GoogleGenAI } from "@google/genai";
import config from "../config/app.config.js";

const gemini = config.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: config.GEMINI_API_KEY }) : null;

// Valid, high-performance Gemini model
const EMOTIONAL_AI_MODEL = "gemini-3.5-flash-lite" //"gemini-2.5-flash";

const SYSTEM_PROMPT = `You are Echo Mind, an empathetic, caring, and emotionally intelligent AI companion.
Your role:
- Provide a safe, judgment-free space where users can anonymously share their feelings, worries, loneliness, stress, or happiness.
- Listen deeply, validate their emotions with warmth and sincerity, and provide gentle comfort.
- Offer practical calming techniques (like 4-7-8 breathing, progressive relaxation, or grounding exercises) when appropriate.
- If the user expresses that they want a "secret chat", "talk to a real human", "find a match", or "peer listener", let them know with empathy that Echo Mind has a built-in anonymous secret chat feature to match them with an available peer listener, and encourage them to click "Search for Anonymous Match".
- If the user expresses severe self-harm or suicidal intent, compassionately urge them to reach out for immediate help: 988 Suicide & Crisis Lifeline (US/Canada), 111 (UK), or local emergency services.
- Keep responses concise, conversational, authentic, and comforting (2-4 short sentences typically). Use warm emojis sparingly like 🌿, 💙, ✨.`;

const FALLBACK_RESPONSES = [
    "I hear you, and what you're feeling right now is completely valid. Take a slow, deep breath with me. You're never alone in this space. 🌿 Would you like me to match you with an anonymous peer for a secret chat?",
    "Thank you for sharing that with me. It takes courage to open up about how you're feeling. I'm right here listening. 💙 If you'd like to talk to a peer listener, you can start an anonymous secret match anytime.",
    "It sounds like you've been carrying a lot on your mind. Please remember to be gentle with yourself today. ✨ We also have peer supporters online if you'd like a secret 1-on-1 chat.",
    "I'm here for you, no matter what you're going through. Your feelings matter. Take this moment just for yourself, one breath at a time. 🌸",
];

export async function generateEmotionalReply(
    userMessage: string,
    history: { sender: "user" | "bot"; text: string }[] = []
): Promise<string> {
    if (!gemini || !config.GEMINI_API_KEY) {
        const randomFallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        return randomFallback;
    }

    try {
        const conversationContext = history
            .slice(-6)
            .map((h) => `${h.sender === "user" ? "User" : "Echo Mind"}: ${h.text}`)
            .join("\n");

        const prompt = conversationContext
            ? `Previous Conversation:\n${conversationContext}\nUser: ${userMessage}\nEcho Mind:`
            : `User: ${userMessage}\nEcho Mind:`;

        const response = await gemini.models.generateContent({
            model: EMOTIONAL_AI_MODEL,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const reply = (response.text ?? "").trim();
        if (!reply) {
            return FALLBACK_RESPONSES[0];
        }
        console.log("AI Response : ", reply)
        return reply;
    } catch (error) {
        console.error("Gemini AI API error, using compassionate fallback:", error);
        return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
}

export default {
    generateEmotionalReply,
};