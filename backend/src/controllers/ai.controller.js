import { generateQuestionsForWeakAreas } from "../services/aiService.js";
import { AIGeneratedQuestion } from "../models/aiGeneratedQuestion.model.js";

export const generateForWeakAreas = async (req, res) => {
    try {
        const result = await generateQuestionsForWeakAreas(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyAIQuestions = async (req, res) => {
    try {
        const { topic, subject } = req.query;

        const filter = { userId: req.user.id };
        if (topic) filter.topic = topic;
        if (subject) filter.subject = subject;

        const questions = await AIGeneratedQuestion.find(filter)
            .sort({ generatedAt: -1 })
            .limit(20);

        res.status(200).json({ count: questions.length, questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};