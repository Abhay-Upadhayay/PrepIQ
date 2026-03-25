import { AttemptAnswer } from "../models/attemptAnswer.model.js";
import { WeakAreaStat } from "../models/weakAreaStat.model.js";

export const updateWeakAreas = async (userId) => {
    // Get all answers for this user
    const answers = await AttemptAnswer.find({ userId });

    // Group by subject+topic
    const statsMap = {};

    for (const answer of answers) {
        const key = `${answer.subject}__${answer.topic}`;
        if (!statsMap[key]) {
            statsMap[key] = { 
                subject: answer.subject, 
                topic: answer.topic, 
                total: 0, 
                correct: 0 
            };
        }
        statsMap[key].total++;
        if (answer.isCorrect) statsMap[key].correct++;
    }

    // Upsert each stat into WeakAreaStat collection
    for (const key of Object.keys(statsMap)) {
        const { subject, topic, total, correct } = statsMap[key];
        const accuracy = Math.round((correct / total) * 100);

        await WeakAreaStat.findOneAndUpdate(
            { userId, subject, topic },
            { 
                userId, subject, topic,
                totalAttempts: total,
                correctCount: correct,
                accuracyPercent: accuracy,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );
    }

    console.log(`✅ Weak areas updated for user ${userId}`);
};

// Get weak topics (accuracy below threshold)
export const getWeakAreas = async (userId, threshold = 50) => {
    const weakAreas = await WeakAreaStat.find({ 
        userId, 
        accuracyPercent: { $lt: threshold },
        totalAttempts: { $gte: 3 } // only flag after at least 3 attempts
    }).sort({ accuracyPercent: 1 });

    return weakAreas;
};