import { AttemptSession } from "../models/attemptSession.model.js";
import { AttemptAnswer } from "../models/attemptAnswer.model.js";
import { WeakAreaStat } from "../models/weakAreaStat.model.js";

// Overall stats — total attempts, avg score, best score
export const getMyStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const sessions = await AttemptSession.find({ 
            userId, 
            endTime: { $exists: true } // only completed sessions
        });

        if (sessions.length === 0) {
            return res.status(200).json({
                totalSessions: 0,
                totalQuestions: 0,
                averagePercentage: 0,
                bestPercentage: 0,
                totalCorrect: 0
            });
        }

        const totalSessions = sessions.length;
        const percentages = sessions.map(s => 
            Math.round((s.score / s.questions.length) * 100)
        );
        const averagePercentage = Math.round(
            percentages.reduce((a, b) => a + b, 0) / totalSessions
        );
        const bestPercentage = Math.max(...percentages);
        const totalCorrect = sessions.reduce((a, b) => a + b.score, 0);
        const totalQuestions = sessions.reduce((a, b) => a + b.questions.length, 0);

        res.status(200).json({
            totalSessions,
            totalQuestions,
            totalCorrect,
            averagePercentage,
            bestPercentage
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Weak areas — topics below 50% accuracy
export const getWeakAreas = async (req, res) => {
    try {
        const userId = req.user.id;

        const weakAreas = await WeakAreaStat.find({
            userId,
            accuracyPercent: { $lt: 50 },
            totalAttempts: { $gte: 3 }
        }).sort({ accuracyPercent: 1 }); // worst first

        res.status(200).json({ 
            count: weakAreas.length,
            weakAreas 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Subject wise breakdown — accuracy per subject
export const getSubjectWiseStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await AttemptAnswer.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$subject",
                    totalAttempts: { $sum: 1 },
                    correctCount: { $sum: { $cond: ["$isCorrect", 1, 0] } }
                }
            },
            {
                $project: {
                    subject: "$_id",
                    totalAttempts: 1,
                    correctCount: 1,
                    accuracyPercent: {
                        $round: [
                            { $multiply: [{ $divide: ["$correctCount", "$totalAttempts"] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { accuracyPercent: -1 } }
        ]);

        res.status(200).json({ stats });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Recent sessions — last 10 attempts with score
export const getRecentSessions = async (req, res) => {
    try {
        const userId = req.user.id;

        const sessions = await AttemptSession.find({ 
            userId,
            endTime: { $exists: true }
        })
        .sort({ endTime: -1 })
        .limit(10)
        .select("type subject score questions startTime endTime durationSeconds");

        const formatted = sessions.map(s => ({
            _id: s._id,
            type: s.type,
            subject: s.subject,
            score: s.score,
            total: s.questions.length,
            percentage: Math.round((s.score / s.questions.length) * 100),
            timeTaken: s.endTime 
                ? Math.round((new Date(s.endTime) - new Date(s.startTime)) / 1000)
                : null,
            date: s.endTime
        }));

        res.status(200).json({ sessions: formatted });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};