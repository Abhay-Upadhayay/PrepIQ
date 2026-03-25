import { AttemptSession } from "../models/attemptSession.model.js";
import { AttemptAnswer } from "../models/attemptAnswer.model.js";
import { Question } from "../models/question.model.js";
import { updateWeakAreas } from "../services/weakAreaService.js";

// Start a new exam/practice session
export const startSession = async (req, res) => {
    try {
        const { type, exam, subject, topic, difficulty, questionCount = 10 } = req.body;

        const durationInSeconds = Number(questionCount) * 2 * 60;

        if (!type || !exam) {
            return res.status(400).json({ message: "type and exam are required" });
        }

        // Build filter to fetch questions
        const filter = { exam };
        if (subject) filter.subject = subject;
        if (topic) filter.topic = topic;
        if (difficulty) filter.difficulty = difficulty;

        // Fetch random questions
        const questions = await Question.aggregate([
            { $match: filter },
            { $sample: { size: Number(questionCount) } }
        ]);

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for given filters" });
        }

        const session = await AttemptSession.create({
            userId: req.user.id,
            type,
            subject: subject || null,
            questions: questions.map(q => q._id),
            startTime: new Date(),
            durationSeconds: durationInSeconds,
            score: 0
        });

        // Send questions WITHOUT revealing correctOption
        const safeQuestions = questions.map(({ _id, questionText, options, subject, topic, difficulty }) => ({
            _id, questionText, options, subject, topic, difficulty
        }));

        res.status(201).json({ 
            message: "Session started", 
            sessionId: session._id, 
            startTime: session.startTime,
            durationSeconds: durationInSeconds,
            questions: safeQuestions 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit answers for a session
export const submitSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { answers } = req.body;
        // answers = [{ questionId, selectedOption }]

        const session = await AttemptSession.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // ⏱️ Check if time already expired
        const now = new Date();
        const elapsed = (now - new Date(session.startTime)) / 1000;
        if (elapsed > session.durationSeconds + 30) { // 30s grace period
            return res.status(400).json({ message: "Session time has expired" });
        }
        
        let score = 0;
        const answerDocs = [];
        const results = [];

        for (const answer of answers) {
            const question = await Question.findById(answer.questionId);
            if (!question) continue;

            const isCorrect = question.correctOption === answer.selectedOption;
            if (isCorrect) score++;

            answerDocs.push({
                userId: req.user.id,
                sessionId,
                questionId: question._id,
                selectedOption: answer.selectedOption,
                isCorrect,
                subject: question.subject,
                topic: question.topic
            });

            results.push({
                questionId: question._id,
                questionText: question.questionText,
                selectedOption: answer.selectedOption,
                correctOption: question.correctOption,
                isCorrect,
                explanation: question.explanation
            });
        }

        // Save all answers
        await AttemptAnswer.insertMany(answerDocs);

        // Update session with score and endTime
        session.score = score;
        session.endTime = new Date();
        await session.save();

        // Update weak areas in background (don't await — let it run)
        updateWeakAreas(req.user.id).catch(console.error);

        res.status(200).json({
            message: "Session submitted",
            score,
            total: answers.length,
            percentage: Math.round((score / answers.length) * 100),
            results
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all sessions for logged in user
export const getMyAttempts = async (req, res) => {
    try {
        const sessions = await AttemptSession.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({ sessions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single session with answers
export const getSessionById = async (req, res) => {
    try {
        const session = await AttemptSession.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        const answers = await AttemptAnswer.find({ sessionId: req.params.sessionId })
            .populate("questionId");

        res.status(200).json({ session, answers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};