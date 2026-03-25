import { Question } from "../models/question.model.js";

// Add a question
export const addQuestion = async (req, res) => {
    try {
        const { exam, subject, topic, difficulty, questionText, options, correctOption, explanation } = req.body;

        if (!exam || !subject || !topic || !difficulty || !questionText || !options || !correctOption) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (options.length !== 4) {
            return res.status(400).json({ message: "Exactly 4 options required" });
        }

        if (!["A", "B", "C", "D"].includes(correctOption)) {
            return res.status(400).json({ message: "correctOption must be A, B, C or D" });
        }

        const question = await Question.create({
            exam, subject, topic, difficulty,
            questionText, options, correctOption, explanation
        });

        res.status(201).json({ message: "Question added", question });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get questions with filters
export const getQuestions = async (req, res) => {
    try {
        const { exam, subject, topic, difficulty, limit = 10 } = req.query;

        const filter = {};
        if (exam) filter.exam = exam;
        if (subject) filter.subject = subject;
        if (topic) filter.topic = topic;
        if (difficulty) filter.difficulty = difficulty;

        const questions = await Question.find(filter).limit(Number(limit));
        res.status(200).json({ count: questions.length, questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single question
export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.status(200).json({ question });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete question
export const deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Question deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};