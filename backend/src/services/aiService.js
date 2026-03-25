import OpenAI from "openai";
import { AIGeneratedQuestion } from "../models/aiGeneratedQuestion.model.js";
import { getWeakAreas } from "./weakAreaService.js";
import config from "../config/config.js";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export const generateQuestionsForWeakAreas = async (userId) => {
    try {
        // Get user's weak topics
        const weakAreas = await getWeakAreas(userId, 50);

        if (weakAreas.length === 0) {
            return { message: "No weak areas found", questions: [] };
        }

        const allGenerated = [];

        // Generate questions for top 3 weakest topics
        const topWeak = weakAreas.slice(0, 3);

        for (const area of topWeak) {
            const prompt = `
You are an expert question setter for ${area.subject} in GATE CS exam.

The student has attempted "${area.topic}" ${area.totalAttempts} times 
but only scored ${area.accuracyPercent}% accuracy. They need more practice.

Generate 3 fresh MCQ questions on "${area.topic}" of medium difficulty.

Return ONLY a valid JSON array. No explanation, no markdown, no extra text.
Format:
[
  {
    "questionText": "...",
    "options": ["option1", "option2", "option3", "option4"],
    "correctOption": "A",
    "explanation": "..."
  }
]
correctOption must be exactly A, B, C or D.
            `;

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            });

            const raw = response.choices[0].message.content.trim();

            // Safe JSON parse
            let parsed;
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                parsed = JSON.parse(cleaned);
            } catch {
                console.error(`Failed to parse AI response for topic: ${area.topic}`);
                continue;
            }

            // Save to DB
            const docs = parsed.map(q => ({
                userId,
                subject: area.subject,
                topic: area.topic,
                questionText: q.questionText,
                options: q.options,
                correctOption: q.correctOption,
                explanation: q.explanation,
                generatedAt: new Date()
            }));

            await AIGeneratedQuestion.insertMany(docs);
            allGenerated.push(...docs);
        }

        return { 
            message: `Generated questions for ${topWeak.length} weak topics`,
            questions: allGenerated 
        };

    } catch (error) {
        console.error("AI generation error:", error.message);
        throw error;
    }
};