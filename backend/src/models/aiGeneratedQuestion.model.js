import mongoose from 'mongoose';

const aiGeneratedQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: [v => v.length > 0, 'Must have at least 2 option']
    },
    correctOption: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const AIGeneratedQuestion = mongoose.model('AIGeneratedQuestion', aiGeneratedQuestionSchema);
