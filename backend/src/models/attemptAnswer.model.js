import mongoose from 'mongoose';

const attemptAnswerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AttemptSession',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selectedOption: {
        type: String
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const AttemptAnswer = mongoose.model('AttemptAnswer', attemptAnswerSchema);
